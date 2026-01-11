import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Enquiry, EnquirySchema } from '../schemas/enquiry.schema';
import { Doctor, DoctorSchema } from '../schemas/doctor.schema';
import { Service, ServiceSchema } from '../schemas/service.schema';
import { SocialMedia, SocialMediaSchema } from '../schemas/social-media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enquiry.name, schema: EnquirySchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: SocialMedia.name, schema: SocialMediaSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
