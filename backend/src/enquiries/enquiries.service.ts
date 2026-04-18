import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enquiry, EnquiryDocument } from '../schemas/enquiry.schema';
import { Gender, Patient, PatientDocument } from '../schemas/patient.schema';
import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { EnquiryStatus } from '../schemas/enquiry.schema';

function enquiryGenderToPatientGender(g: string): Gender {
  switch (g) {
    case 'Male':
      return Gender.MALE;
    case 'Female':
      return Gender.FEMALE;
    case 'Others':
      return Gender.OTHER;
    default:
      return Gender.MALE;
  }
}

function assigneeRefId(assignee: unknown): string | null {
  if (assignee == null || assignee === '') return null;
  if (assignee instanceof Types.ObjectId) return assignee.toString();
  if (typeof assignee === 'string') return assignee;
  if (typeof assignee === 'object' && assignee !== null && '_id' in assignee) {
    const id = (assignee as { _id: Types.ObjectId | string })._id;
    if (id instanceof Types.ObjectId) return id.toString();
    if (typeof id === 'string') return id;
  }
  return null;
}

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto) {
    let patient = await this.patientModel.findOne({ patient_mob: createEnquiryDto.patient_mob }).exec();
    
    if (!patient) {
      patient = new this.patientModel({
        patient_name: createEnquiryDto.patient_name,
        patient_age: createEnquiryDto.patient_age.toString(),
        patient_mob: createEnquiryDto.patient_mob,
        patient_gender: enquiryGenderToPatientGender(createEnquiryDto.patient_gender),
        queries_raised: [],
      });
      await patient.save();
      console.log(`New patient created: ${patient.patient_mob}`);
    }
    // Existing row keyed by mobile: keep first-recorded name/age/gender; truth per submission lives on Enquiry.

    const enquiry = new this.enquiryModel({
      patient_name: createEnquiryDto.patient_name,
      patient_age: createEnquiryDto.patient_age,
      patient_mob: createEnquiryDto.patient_mob,
      patient_gender: createEnquiryDto.patient_gender,
      message: createEnquiryDto.message || '',
      service: createEnquiryDto.service,
      mode_of_conversation: createEnquiryDto.mode_of_conversation,
      speciality: createEnquiryDto.speciality || '',
      status: EnquiryStatus.NEW,
      assignee: null,
    });
    const savedEnquiry = await enquiry.save();
    console.log(`Enquiry created: ${savedEnquiry._id} for patient: ${patient.patient_mob}`);

    if (!patient.queries_raised) {
      patient.queries_raised = [];
    }
    if (!patient.queries_raised.some(id => id.toString() === savedEnquiry._id.toString())) {
      patient.queries_raised.push(savedEnquiry._id);
      await patient.save();
      console.log(`Enquiry ${savedEnquiry._id} mapped to patient ${patient.patient_mob}`);
    }

    return savedEnquiry.populate('assignee', 'name specialization employee_id');
  }

  async findAll(page: number = 1, limit: number = 10, status?: EnquiryStatus, assignee?: string) {
    const query: any = {};
    if (status) query.status = status;
    if (assignee) query.assignee = new Types.ObjectId(assignee);

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.enquiryModel
        .find(query)
        .populate('assignee', 'name specialization employee_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.enquiryModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const enquiry = await this.enquiryModel
      .findById(id)
      .populate('assignee', 'name specialization employee_id')
      .exec();
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto) {
    const enquiry = await this.enquiryModel.findById(id).exec();
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    const enquiryId = new Types.ObjectId(id);
    const oldAssigneeId = assigneeRefId(enquiry.assignee);

    const $set: Record<string, unknown> = {};
    const dto = updateEnquiryDto as Record<string, unknown>;

    const copyIfDefined = (key: string) => {
      if (dto[key] !== undefined) {
        $set[key] = dto[key];
      }
    };

    copyIfDefined('patient_name');
    copyIfDefined('patient_age');
    copyIfDefined('patient_mob');
    copyIfDefined('patient_gender');
    copyIfDefined('message');
    copyIfDefined('service');
    copyIfDefined('mode_of_conversation');
    copyIfDefined('speciality');
    copyIfDefined('status');

    if (dto.assignee !== undefined) {
      const raw = dto.assignee;
      if (raw === null || raw === '') {
        $set.assignee = null;
      } else {
        $set.assignee = new Types.ObjectId(String(raw));
      }
    }

    const hasUpdates = Object.keys($set).length > 0;
    const savedEnquiry = hasUpdates
      ? await this.enquiryModel
          .findByIdAndUpdate(id, { $set }, { new: true, runValidators: false })
          .populate('assignee', 'name specialization employee_id')
          .exec()
      : await this.enquiryModel.findById(id).populate('assignee', 'name specialization employee_id').exec();

    if (!savedEnquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    const newAssigneeId = assigneeRefId(savedEnquiry.assignee);

    // Update doctor's queries_assigned array
    // Remove from old assignee if exists
    if (oldAssigneeId && oldAssigneeId !== newAssigneeId) {
      await this.doctorModel.findByIdAndUpdate(
        oldAssigneeId,
        { $pull: { queries_assigned: enquiryId } },
        { new: true }
      ).exec();
    }

    if (newAssigneeId && newAssigneeId !== oldAssigneeId) {
      const doctor = await this.doctorModel.findById(newAssigneeId).exec();
      if (doctor) {
        if (!doctor.queries_assigned) {
          doctor.queries_assigned = [];
        }
        if (!doctor.queries_assigned.some((queryId: Types.ObjectId) => queryId.toString() === enquiryId.toString())) {
          doctor.queries_assigned.push(enquiryId);
          await doctor.save();
        }
      }
    }

    if (!newAssigneeId && oldAssigneeId) {
      await this.doctorModel.findByIdAndUpdate(
        oldAssigneeId,
        { $pull: { queries_assigned: enquiryId } },
        { new: true }
      ).exec();
    }

    return savedEnquiry;
  }

  async remove(id: string) {
    const enquiryId = new Types.ObjectId(id);
    const enquiry = await this.enquiryModel.findByIdAndDelete(id).exec();
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    await this.unlinkDeletedEnquiries([enquiryId]);
    return { message: 'Enquiry deleted successfully' };
  }

  async bulkRemove(ids: string[]) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const existing = await this.enquiryModel.find({ _id: { $in: objectIds } }).select('_id').lean().exec();
    const toDelete = existing.map((d) => d._id as Types.ObjectId);
    if (toDelete.length === 0) {
      return { deletedCount: 0 };
    }
    await this.enquiryModel.deleteMany({ _id: { $in: toDelete } }).exec();
    await this.unlinkDeletedEnquiries(toDelete);
    return { deletedCount: toDelete.length };
  }

  private async unlinkDeletedEnquiries(enquiryIds: Types.ObjectId[]) {
    if (enquiryIds.length === 0) return;
    await Promise.all([
      this.patientModel
        .updateMany({ queries_raised: { $in: enquiryIds } }, { $pullAll: { queries_raised: enquiryIds } })
        .exec(),
      this.doctorModel
        .updateMany({ queries_assigned: { $in: enquiryIds } }, { $pullAll: { queries_assigned: enquiryIds } })
        .exec(),
    ]);
  }

  async bulkUnassignDoctorIds(doctorIds: string[]) {
    const objectIds = doctorIds.map((id) => new Types.ObjectId(id));
    await this.enquiryModel
      .updateMany({ assignee: { $in: objectIds } }, { $set: { assignee: null } })
      .exec();
    return { message: 'Enquiries unassigned successfully' };
  }

  async findByAssignee(assigneeId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.enquiryModel
        .find({ assignee: new Types.ObjectId(assigneeId) })
        .populate('assignee', 'name specialization employee_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.enquiryModel.countDocuments({ assignee: new Types.ObjectId(assigneeId) }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllForExport(status?: EnquiryStatus, assignee?: string) {
    const query: any = {};
    if (status) query.status = status;
    if (assignee) query.assignee = new Types.ObjectId(assignee);

    return this.enquiryModel
      .find(query)
      .populate('assignee', 'name specialization employee_id')
      .sort({ createdAt: -1 })
      .exec();
  }
}
