import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocialMediaDocument = SocialMedia & Document;

@Schema({ timestamps: true })
export class SocialMedia {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  icon_url: string;

  @Prop({ required: true })
  href: string;
}

export const SocialMediaSchema = SchemaFactory.createForClass(SocialMedia);
