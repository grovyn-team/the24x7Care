import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingsDocument = SiteSettings & Document;

@Schema({ timestamps: true, collection: 'sitesettings' })
export class SiteSettings {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({
    type: {
      greetingPart1: String,
      greetingPart2: String,
      headline: String,
      paragraph1: String,
      paragraph2: String,
      busyCta: String,
      whatsappNumber: String,
      imageUrl: { type: String, required: false },
      imageAlt: { type: String, required: false },
    },
    default: {},
  })
  hero: Record<string, string | undefined>;

  @Prop({
    type: {
      tagline: String,
    },
    default: {},
  })
  footer: Record<string, string | undefined>;

  @Prop({
    type: [
      {
        quote: String,
        author: String,
        role: String,
        rating: Number,
        avatar: { type: String, required: false },
      },
    ],
    default: [],
  })
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
    avatar?: string;
  }>;

  @Prop({
    type: [{ value: String, label: String }],
    default: [],
  })
  statistics: Array<{ value: string; label: string }>;

  @Prop({
    type: {
      heroTitle: String,
      heroIntro: String,
      storyHeading: String,
      storyParagraph1: String,
      storyParagraph2: String,
      storyParagraph3: String,
      whyTrustHeading: String,
      whyTrustSubheading: String,
      whyTrustImageUrl: String,
      whyTrustImageAlt: String,
      whyTrustFeatures: [{ title: String, description: String, iconKey: String }],
      coreValuesHeading: String,
      coreValuesSubheading: String,
      coreValues: [{ title: String, description: String, iconKey: String }],
    },
    default: {},
  })
  about: Record<string, unknown>;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
