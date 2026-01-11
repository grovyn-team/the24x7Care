import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DoctorDocument = Doctor & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true, match: /^[0-9]{10}$/ })
  mobile: string;

  @Prop({ required: true, unique: true })
  employee_id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Enquiry' }], default: [] })
  queries_assigned: Types.ObjectId[];

  @Prop({
    type: String,
    enum: Object.values(Gender),
    required: true,
  })
  gender: Gender;

  @Prop({ default: null })
  avatar_url: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
