import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    private readonly authService: AuthService,
  ) {}

  private stripPortalFields(dto: CreateDoctorDto | UpdateDoctorDto) {
    const {
      login_email,
      login_password,
      send_portal_welcome_email,
      ...doctorFields
    } = dto as CreateDoctorDto;
    return { login_email, login_password, send_portal_welcome_email, doctorFields };
  }

  private assertLoginPair(login_email?: string, login_password?: string) {
    const hasEmail = Boolean(login_email?.trim());
    const hasPassword = Boolean(login_password);
    if (hasEmail !== hasPassword) {
      throw new BadRequestException(
        'login_email and login_password must both be provided, or both omitted',
      );
    }
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const { login_email, login_password, send_portal_welcome_email, doctorFields } =
      this.stripPortalFields(createDoctorDto);
    this.assertLoginPair(login_email, login_password);

    const doctor = new this.doctorModel(doctorFields);
    await doctor.save();

    if (login_email && login_password) {
      await this.authService.upsertDoctorPortalAccount(
        doctor.employee_id,
        login_email,
        login_password,
        {
          sendWelcome: Boolean(send_portal_welcome_email),
          doctorName: doctor.name,
        },
      );
    }

    return doctor;
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

    const ids = data.map((d) => d.employee_id);
    const emailMap = await this.authService.getPortalEmailsByEmployeeIds(ids);

    const rows = data.map((d) => {
      const obj = d.toObject();
      return {
        ...obj,
        portal_email: emailMap[d.employee_id] ?? null,
      };
    });

    return {
      data: rows,
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
    const emailMap = await this.authService.getPortalEmailsByEmployeeIds([
      doctor.employee_id,
    ]);
    const obj = doctor.toObject();
    return {
      ...obj,
      portal_email: emailMap[doctor.employee_id] ?? null,
    };
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

    const { login_email, login_password, send_portal_welcome_email, doctorFields } =
      this.stripPortalFields(updateDoctorDto as CreateDoctorDto);

    if (login_email !== undefined && login_password !== undefined) {
      this.assertLoginPair(login_email, login_password);
    }

    const assignable = ['name', 'specialization', 'mobile', 'gender', 'avatar_url'] as const;
    for (const key of assignable) {
      const v = (doctorFields as Record<string, unknown>)[key];
      if (v !== undefined) {
        (doctor as unknown as Record<string, unknown>)[key] = v;
      }
    }
    await doctor.save();

    if (login_email && login_password) {
      await this.authService.upsertDoctorPortalAccount(
        doctor.employee_id,
        login_email,
        login_password,
        {
          sendWelcome: Boolean(send_portal_welcome_email),
          doctorName: doctor.name,
        },
      );
    } else if (login_password && !login_email) {
      await this.authService.updateDoctorPortalPassword(
        doctor.employee_id,
        login_password,
      );
    } else if (login_email && !login_password) {
      await this.authService.updateDoctorPortalEmailOnly(doctor.employee_id, login_email);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    await this.authService.deletePortalUserByEmployeeId(doctor.employee_id);
    await doctor.deleteOne();
    return { message: 'Doctor deleted successfully' };
  }

  async bulkRemove(ids: string[]) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const doctors = await this.doctorModel
      .find({ _id: { $in: objectIds } })
      .select('employee_id')
      .lean()
      .exec();
    for (const d of doctors) {
      await this.authService.deletePortalUserByEmployeeId(d.employee_id as string);
    }
    const result = await this.doctorModel.deleteMany({ _id: { $in: objectIds } }).exec();
    return { deletedCount: result.deletedCount ?? 0 };
  }

  async findAllForExport() {
    const list = await this.doctorModel
      .find()
      .populate('queries_assigned')
      .sort({ createdAt: -1 })
      .exec();
    const ids = list.map((d) => d.employee_id);
    const emailMap = await this.authService.getPortalEmailsByEmployeeIds(ids);
    return list.map((d) => {
      const o = d.toObject();
      return { ...o, portal_email: emailMap[d.employee_id] ?? null };
    });
  }

  async createBulk(doctorsData: CreateDoctorDto[]) {
    const createdDoctors = [];
    const errors = [];

    for (const doctorData of doctorsData) {
      try {
        const doc = await this.create(doctorData);
        createdDoctors.push(doc);
      } catch (error: any) {
        errors.push({
          data: doctorData,
          error: error.message || 'Failed to create doctor',
        });
      }
    }

    return {
      created: createdDoctors,
      errors,
      totalCreated: createdDoctors.length,
      totalErrors: errors.length,
    };
  }

  async updateAvailability(employeeId: string, availability: any[]) {
    const doctor = await this.doctorModel.findOne({ employee_id: employeeId }).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with employee ID ${employeeId} not found`);
    }
    doctor.availability = availability;
    return doctor.save();
  }
}
