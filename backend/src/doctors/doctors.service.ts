import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.doctorModel
        .find()
        .populate('queries_assigned')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.doctorModel.countDocuments().exec(),
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
    const doctor = await this.doctorModel
      .findById(id)
      .populate('queries_assigned')
      .exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async findByEmployeeId(employeeId: string) {
    const doctor = await this.doctorModel
      .findOne({ employee_id: employeeId })
      .populate('queries_assigned')
      .exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with employee ID ${employeeId} not found`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    Object.assign(doctor, updateDoctorDto);
    return doctor.save();
  }

  async remove(id: string) {
    const doctor = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return { message: 'Doctor deleted successfully' };
  }

  async findAllForExport() {
    return this.doctorModel
      .find()
      .populate('queries_assigned')
      .sort({ createdAt: -1 })
      .exec();
  }
}
