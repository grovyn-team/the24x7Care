import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroDiscountService } from './hero-discount.service';
import { HeroDiscountController } from './hero-discount.controller';
import { HeroDiscount, HeroDiscountSchema } from '../schemas/hero-discount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HeroDiscount.name, schema: HeroDiscountSchema },
    ]),
  ],
  controllers: [HeroDiscountController],
  providers: [HeroDiscountService],
  exports: [HeroDiscountService],
})
export class HeroDiscountModule {}
