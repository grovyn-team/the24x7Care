import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatientDocument = Patient & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  patient_name: string;

  @Prop({ required: true })
  patient_age: string;

  @Prop({
    type: String,
    enum: Object.values(Gender),
    required: true,
  })
  patient_gender: Gender;

  @Prop({ required: true, unique: true, match: /^[0-9]{10}$/ })
  patient_mob: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Enquiry' }], default: [] })
  queries_raised: Types.ObjectId[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
