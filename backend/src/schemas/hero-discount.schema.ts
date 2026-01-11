import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroDiscountDocument = HeroDiscount & Document;

@Schema({ timestamps: true })
export class HeroDiscount {
  @Prop({ required: true, default: 0 })
  discount: number;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const HeroDiscountSchema = SchemaFactory.createForClass(HeroDiscount);
