import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry, EnquiryDocument } from '../schemas/enquiry.schema';
import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { SocialMedia, SocialMediaDocument } from '../schemas/social-media.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(SocialMedia.name)
    private socialMediaModel: Model<SocialMediaDocument>,
  ) {}

  async getDashboardStats() {
    const [totalEnquiries, newEnquiries, totalDoctors, totalServices, recentEnquiries] =
      await Promise.all([
        this.enquiryModel.countDocuments().exec(),
        this.enquiryModel.countDocuments({ status: 'new' }).exec(),
        this.doctorModel.countDocuments().exec(),
        this.serviceModel.countDocuments().exec(),
        this.enquiryModel
          .find()
          .populate('assignee', 'name employee_id')
          .sort({ createdAt: -1 })
          .limit(10)
          .exec(),
      ]);

    return {
      totalEnquiries,
      newEnquiries,
      totalDoctors,
      totalServices,
      recentEnquiries,
    };
  }
}
