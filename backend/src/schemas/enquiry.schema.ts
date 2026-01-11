import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnquiryDocument = Enquiry & Document;

export enum EnquiryStatus {
  NEW = 'new',
  VIEWED = 'viewed',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Enquiry {
  @Prop({ required: true })
  patient_name: string;

  @Prop({ required: true, min: 1, max: 99 })
  patient_age: number;

  @Prop({ required: true, match: /^[0-9]{10}$/ })
  patient_mob: string;

  @Prop({ required: true, maxlength: 200 })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', default: null })
  assignee: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(EnquiryStatus),
    default: EnquiryStatus.NEW,
  })
  status: EnquiryStatus;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
