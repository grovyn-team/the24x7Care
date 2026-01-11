import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    required: true,
  })
  role: UserRole;

  @Prop({ type: String, default: null })
  googleId: string;

  @Prop({ type: String, default: null })
  refreshToken: string;

  @Prop({ type: String, default: null })
  doctorId: string; // Reference to Doctor employee_id if role is doctor
}

export const UserSchema = SchemaFactory.createForClass(User);
