import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoreValueDocument = CoreValue & Document;

@Schema({ timestamps: true })
export class CoreValue {
  @Prop({ required: true })
  icon_url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const CoreValueSchema = SchemaFactory.createForClass(CoreValue);
