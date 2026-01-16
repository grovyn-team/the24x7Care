import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enquiry, EnquiryDocument } from '../schemas/enquiry.schema';
import { Patient, PatientDocument } from '../schemas/patient.schema';
import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { EnquiryStatus } from '../schemas/enquiry.schema';

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
        patient_gender: 'male',
        queries_raised: [],
      });
      await patient.save();
      console.log(`New patient created: ${patient.patient_mob}`);
    } else {
      let updated = false;
      if (patient.patient_name !== createEnquiryDto.patient_name) {
        patient.patient_name = createEnquiryDto.patient_name;
        updated = true;
      }
      if (patient.patient_age !== createEnquiryDto.patient_age.toString()) {
        patient.patient_age = createEnquiryDto.patient_age.toString();
        updated = true;
      }
      if (updated) {
        await patient.save();
        console.log(`Patient updated: ${patient.patient_mob}`);
      }
    }

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
    const oldAssigneeId = enquiry.assignee ? enquiry.assignee.toString() : null;
    const newAssigneeId = updateEnquiryDto.assignee || null;

    // Update the enquiry
    if (updateEnquiryDto.assignee) {
      updateEnquiryDto.assignee = new Types.ObjectId(updateEnquiryDto.assignee) as any;
    }

    Object.assign(enquiry, updateEnquiryDto);
    const savedEnquiry = await enquiry.save();

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

    return savedEnquiry.populate('assignee', 'name specialization employee_id');
  }

  async remove(id: string) {
    const enquiry = await this.enquiryModel.findByIdAndDelete(id).exec();
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return { message: 'Enquiry deleted successfully' };
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
