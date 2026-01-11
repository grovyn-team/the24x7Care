import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialMedia, SocialMediaDocument } from '../schemas/social-media.schema';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectModel(SocialMedia.name) private socialMediaModel: Model<SocialMediaDocument>,
  ) {}

  async create(createSocialMediaDto: CreateSocialMediaDto) {
    const socialMedia = new this.socialMediaModel(createSocialMediaDto);
    return socialMedia.save();
  }

  async findAll() {
    return this.socialMediaModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const socialMedia = await this.socialMediaModel.findById(id).exec();
    if (!socialMedia) {
      throw new NotFoundException(`Social media with ID ${id} not found`);
    }
    return socialMedia;
  }

  async update(id: string, updateSocialMediaDto: UpdateSocialMediaDto) {
    const socialMedia = await this.socialMediaModel.findById(id).exec();
    if (!socialMedia) {
      throw new NotFoundException(`Social media with ID ${id} not found`);
    }
    Object.assign(socialMedia, updateSocialMediaDto);
    return socialMedia.save();
  }

  async remove(id: string) {
    const socialMedia = await this.socialMediaModel.findByIdAndDelete(id).exec();
    if (!socialMedia) {
      throw new NotFoundException(`Social media with ID ${id} not found`);
    }
    return { message: 'Social media deleted successfully' };
  }
}
