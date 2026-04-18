import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Enquiry, EnquirySchema } from '../schemas/enquiry.schema';
import { Doctor, DoctorSchema } from '../schemas/doctor.schema';
import { Service, ServiceSchema } from '../schemas/service.schema';
import { SocialMedia, SocialMediaSchema } from '../schemas/social-media.schema';
import { CoreValue, CoreValueSchema } from '../schemas/core-value.schema';
import { LeadershipTeam, LeadershipTeamSchema } from '../schemas/leadership-team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enquiry.name, schema: EnquirySchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: SocialMedia.name, schema: SocialMediaSchema },
      { name: CoreValue.name, schema: CoreValueSchema },
      { name: LeadershipTeam.name, schema: LeadershipTeamSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
