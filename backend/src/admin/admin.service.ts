import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry, EnquiryDocument } from '../schemas/enquiry.schema';
import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { SocialMedia, SocialMediaDocument } from '../schemas/social-media.schema';
import { CoreValue, CoreValueDocument } from '../schemas/core-value.schema';
import { LeadershipTeam, LeadershipTeamDocument } from '../schemas/leadership-team.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(SocialMedia.name)
    private socialMediaModel: Model<SocialMediaDocument>,
    @InjectModel(CoreValue.name) private coreValueModel: Model<CoreValueDocument>,
    @InjectModel(LeadershipTeam.name) private leadershipModel: Model<LeadershipTeamDocument>,
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

  async getContentSummary() {
    const [services, coreValues, leadership, socialMedia, doctors] = await Promise.all([
      this.serviceModel.countDocuments().exec(),
      this.coreValueModel.countDocuments().exec(),
      this.leadershipModel.countDocuments().exec(),
      this.socialMediaModel.countDocuments().exec(),
      this.doctorModel.countDocuments().exec(),
    ]);

    return {
      services,
      coreValues,
      leadership,
      socialMedia,
      doctors,
    };
  }
}
