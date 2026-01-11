import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  perks: string[];

  @Prop({ required: true, match: /^[0-9]{10}$/, default: '0000000000' })
  book_via: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
