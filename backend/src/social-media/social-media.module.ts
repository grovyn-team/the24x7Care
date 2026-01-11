import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialMediaService } from './social-media.service';
import { SocialMediaController } from './social-media.controller';
import { SocialMedia, SocialMediaSchema } from '../schemas/social-media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialMedia.name, schema: SocialMediaSchema }]),
  ],
  controllers: [SocialMediaController],
  providers: [SocialMediaService],
  exports: [SocialMediaService],
})
export class SocialMediaModule {}
