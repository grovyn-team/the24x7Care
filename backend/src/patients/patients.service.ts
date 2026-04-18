import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient, PatientDocument } from '../schemas/patient.schema';
import { Enquiry, EnquiryDocument } from '../schemas/enquiry.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.patientModel
        .find()
        .populate('queries_raised')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patientModel.countDocuments().exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(mobile: string) {
    const patient = await this.patientModel
      .findOne({ patient_mob: mobile })
      .populate('queries_raised')
      .exec();
    if (!patient) {
      throw new NotFoundException(`Patient with mobile ${mobile} not found`);
    }
    return patient;
  }

  async findAllForExport() {
    return this.patientModel
      .find()
      .populate('queries_raised')
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid patient id');
    }
    const patient = await this.patientModel.findById(id).select('queries_raised').exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const refIds = (patient.queries_raised || []).map((q) => new Types.ObjectId(q.toString()));
    if (refIds.length > 0) {
      const stillAlive = await this.enquiryModel.countDocuments({ _id: { $in: refIds } }).exec();
      if (stillAlive > 0) {
        throw new BadRequestException(
          'This patient still has linked enquiries in the database. Delete those enquiries first, then delete the patient.',
        );
      }
    }

    await this.patientModel.findByIdAndDelete(id).exec();
    return { message: 'Patient deleted successfully' };
  }

  async bulkRemove(ids: string[]) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const patients = await this.patientModel
      .find({ _id: { $in: objectIds } })
      .select('queries_raised')
      .exec();

    if (patients.length !== ids.length) {
      throw new NotFoundException('One or more patients were not found');
    }

    const linkedEnquiryIdStrings = new Set<string>();
    for (const p of patients) {
      for (const q of p.queries_raised || []) {
        linkedEnquiryIdStrings.add(q.toString());
      }
    }

    if (linkedEnquiryIdStrings.size > 0) {
      const refIds = [...linkedEnquiryIdStrings].map((s) => new Types.ObjectId(s));
      const stillAlive = await this.enquiryModel.countDocuments({ _id: { $in: refIds } }).exec();
      if (stillAlive > 0) {
        throw new BadRequestException(
          `Cannot delete selected patients: ${stillAlive} linked enquiry(ies) still exist. Delete those enquiries first.`,
        );
      }
    }

    const result = await this.patientModel.deleteMany({ _id: { $in: objectIds } }).exec();
    return { deletedCount: result.deletedCount ?? 0 };
  }
}
