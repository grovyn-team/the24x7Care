import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from '../schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

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
}
