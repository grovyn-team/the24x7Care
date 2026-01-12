import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ServicesModule } from './services/services.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { CoreValuesModule } from './core-values/core-values.module';
import { LeadershipTeamModule } from './leadership-team/leadership-team.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { HeroDiscountModule } from './hero-discount/hero-discount.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/the247care'),
    AuthModule,
    EnquiriesModule,
    PatientsModule,
    DoctorsModule,
    ServicesModule,
    SocialMediaModule,
    CoreValuesModule,
    LeadershipTeamModule,
    PaymentModule,
    AdminModule,
    HeroDiscountModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
