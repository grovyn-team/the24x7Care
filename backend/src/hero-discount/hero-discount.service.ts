import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeroDiscount, HeroDiscountDocument } from '../schemas/hero-discount.schema';
import { UpdateHeroDiscountDto } from './dto/update-hero-discount.dto';

@Injectable()
export class HeroDiscountService {
  constructor(
    @InjectModel(HeroDiscount.name)
    private heroDiscountModel: Model<HeroDiscountDocument>,
  ) {
    this.initializeDefault();
  }

  async getDiscount() {
    let discount = await this.heroDiscountModel.findOne().exec();
    if (!discount) {
      discount = await this.initializeDefault();
    }
    return discount;
  }

  async updateDiscount(updateHeroDiscountDto: UpdateHeroDiscountDto) {
    let discount = await this.heroDiscountModel.findOne().exec();
    if (!discount) {
      discount = new this.heroDiscountModel(updateHeroDiscountDto);
    } else {
      Object.assign(discount, updateHeroDiscountDto);
    }
    return discount.save();
  }

  private async initializeDefault() {
    const existing = await this.heroDiscountModel.findOne().exec();
    if (!existing) {
      const defaultDiscount = new this.heroDiscountModel({
        discount: 0,
        isActive: true,
      });
      return defaultDiscount.save();
    }
    return existing;
  }
}
