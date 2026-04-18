import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSettings, SiteSettingsDocument } from '../schemas/site-settings.schema';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

export const SITE_DEFAULTS = {
  hero: {
    greetingPart1: 'जय',
    greetingPart2: 'जोहार',
    headline: 'Compassionate Healthcare, Delivered at Home',
    paragraph1:
      "Welcome to The 247 Care, we understand that your health is more than just physical; it's about nurturing your mind, body, and spirit. Our comprehensive home healthcare services are designed to provide you with personalized, compassionate care in the comfort of your own home.",
    paragraph2: 'Experience premium medical services in the comfort of your own sanctuary.',
    busyCta: 'Too Busy? Connect on',
    whatsappNumber: '917974753889',
    imageUrl: '',
    imageAlt: 'Healthcare professional supporting a patient at home',
  },
  footer: {
    tagline:
      'Providing exceptional healthcare services with a focus on compassion, integrity, and clinical excellence.',
    addressLine1: '123 Healthcare Street',
    addressLine2: 'Medical District, City 12345',
    addressLine3: '',
    contactPhone: '+91 79747 53889',
    contactEmail: 'info@the247care.com',
  },
  about: {
    heroTitle: 'About The24x7Care',
    heroIntro:
      'We are dedicated to providing exceptional home healthcare services with a focus on compassion, integrity, and clinical excellence. Our mission is to bring quality medical care directly to your home, ensuring comfort and peace of mind for you and your loved ones.',
    storyHeading: 'Our Story',
    storyParagraph1:
      'Founded with a vision to revolutionize home healthcare, The24x7Care has been serving families across the nation for over 15 years. What started as a small team of dedicated healthcare professionals has grown into a trusted network of over 500 certified caregivers, nurses, and medical specialists.',
    storyParagraph2:
      'Our commitment extends beyond medical care. We believe in building lasting relationships with our patients and their families, understanding that healthcare is as much about emotional support as it is about physical well-being.',
    storyParagraph3:
      'Every member of our team undergoes rigorous screening and continuous training to ensure the highest standards of care. We match our caregivers not just based on medical qualifications, but also on personality, communication style, and shared values.',
    whyTrustHeading: 'Why Families Trust Us With Their Loved Ones',
    whyTrustSubheading:
      "We don't just provide medical care; we build relationships. Our approach is holistic, focusing on physical health, mental well-being, and emotional support.",
    whyTrustImageUrl: '',
    whyTrustImageAlt: 'Medical professional providing quality care',
    whyTrustFeatures: [
      {
        title: 'Vetted Professionals',
        description: 'Every caregiver undergoes rigorous background checks and continuous training.',
        iconKey: 'shield',
      },
      {
        title: 'Flexible Scheduling',
        description: 'From 2-hour visits to 24/7 live-in care, we adapt to your schedule.',
        iconKey: 'calendar',
      },
      {
        title: 'Personalized Matching',
        description: 'We match caregivers based on compatibility, personality, and specific needs.',
        iconKey: 'user',
      },
      {
        title: 'Cost Effective',
        description:
          'Transparent pricing with no hidden fees, ensuring you get value for your healthcare investment.',
        iconKey: 'currency',
      },
      {
        title: '100% Confidential',
        description:
          'Complete privacy guaranteed for all your medical information with strict confidentiality protocols.',
        iconKey: 'lock',
      },
    ],
    coreValuesHeading: 'Our Core Values',
    coreValuesSubheading:
      'These fundamental principles guide everything we do and shape how we care for our patients.',
    coreValues: [
      {
        title: 'Compassion',
        description:
          "We treat every patient with dignity, respect, and genuine care, understanding that each person's journey is unique.",
        iconKey: 'heart',
      },
      {
        title: 'Excellence',
        description:
          'We maintain the highest standards of medical care through continuous training, certification, and quality assurance.',
        iconKey: 'award',
      },
      {
        title: 'Integrity',
        description:
          'We conduct our business with honesty, transparency, and ethical practices, earning the trust of patients and families.',
        iconKey: 'shield-check',
      },
    ],
  },
  testimonials: [
    {
      quote:
        "The caregivers treated my father with such dignity and respect. It wasn't just about medical needs; they truly connected with him. It gave us peace of mind knowing he was in safe hands every single day.",
      author: 'Sarah Jenkins',
      role: 'Daughter of Patient',
      rating: 5,
      avatar: '',
    },
    {
      quote:
        'The caregivers treated my father like their own family. We are forever grateful for the compassionate care they provided during his recovery.',
      author: 'Michael Chen',
      role: 'Son of Patient',
      rating: 5,
      avatar: '',
    },
    {
      quote:
        "Professional, caring, and reliable. The team went above and beyond to ensure my mother's comfort and well-being.",
      author: 'Emily Rodriguez',
      role: 'Daughter of Patient',
      rating: 5,
      avatar: '',
    },
  ],
  statistics: [
    { value: '15+', label: 'Years of Experience' },
    { value: '500+', label: 'Certified Professionals' },
    { value: '2k+', label: 'Happy Families' },
    { value: '24x7', label: 'Medical Support' },
  ],
};

function deepMerge<T extends Record<string, unknown>>(base: T, patch: Partial<T> | null | undefined): T {
  if (!patch) return { ...base };
  const out = { ...base } as T;
  for (const k of Object.keys(patch)) {
    const pk = patch[k as keyof T];
    if (pk !== undefined && pk !== null) {
      (out as Record<string, unknown>)[k] = pk as unknown;
    }
  }
  return out;
}

function normalizeAboutMerged(merged: typeof SITE_DEFAULTS.about): typeof SITE_DEFAULTS.about {
  const out = { ...merged };
  if (!Array.isArray(out.whyTrustFeatures) || out.whyTrustFeatures.length === 0) {
    out.whyTrustFeatures = [...SITE_DEFAULTS.about.whyTrustFeatures];
  }
  if (!Array.isArray(out.coreValues) || out.coreValues.length === 0) {
    out.coreValues = [...SITE_DEFAULTS.about.coreValues];
  }
  return out;
}

@Injectable()
export class SiteSettingsService {
  constructor(@InjectModel(SiteSettings.name) private readonly model: Model<SiteSettingsDocument>) {}

  private mergeDoc(doc: SiteSettingsDocument | null) {
    const hero = deepMerge(SITE_DEFAULTS.hero as unknown as Record<string, unknown>, doc?.hero as Record<string, unknown>);
    const footer = deepMerge(
      SITE_DEFAULTS.footer as unknown as Record<string, unknown>,
      doc?.footer as Record<string, unknown>,
    );
    const testimonials =
      doc?.testimonials && doc.testimonials.length > 0 ? doc.testimonials : SITE_DEFAULTS.testimonials;
    const statistics =
      doc?.statistics && doc.statistics.length > 0 ? doc.statistics : SITE_DEFAULTS.statistics;
    const aboutRaw = deepMerge(
      SITE_DEFAULTS.about as unknown as Record<string, unknown>,
      (doc?.about as Record<string, unknown>) || {},
    ) as unknown as typeof SITE_DEFAULTS.about;
    const about = normalizeAboutMerged(aboutRaw);
    return {
      hero: hero as typeof SITE_DEFAULTS.hero,
      footer: footer as typeof SITE_DEFAULTS.footer,
      about,
      testimonials,
      statistics,
      updatedAt: doc && 'updatedAt' in doc ? (doc as SiteSettingsDocument & { updatedAt?: Date }).updatedAt : undefined,
    };
  }

  async getPublicBundle() {
    const doc = await this.model.findOne({ key: 'default' }).exec();
    return this.mergeDoc(doc);
  }

  async getForAdmin() {
    return this.getPublicBundle();
  }

  async update(dto: UpdateSiteSettingsDto) {
    let doc = await this.model.findOne({ key: 'default' }).exec();
    if (!doc) {
      doc = new this.model({
        key: 'default',
        hero: {},
        footer: {},
        about: {},
        testimonials: [],
        statistics: [],
      });
    }
    if (dto.hero) {
      doc.hero = deepMerge((doc.hero || {}) as Record<string, unknown>, dto.hero as Record<string, unknown>) as SiteSettings['hero'];
    }
    if (dto.footer) {
      doc.footer = deepMerge((doc.footer || {}) as Record<string, unknown>, dto.footer as Record<string, unknown>) as SiteSettings['footer'];
    }
    if (dto.testimonials !== undefined) {
      doc.testimonials = dto.testimonials.map((t) => ({
        quote: t.quote,
        author: t.author,
        role: t.role,
        rating: t.rating ?? 5,
        avatar: t.avatar,
      }));
    }
    if (dto.statistics !== undefined) {
      doc.statistics = dto.statistics;
    }
    if (dto.about) {
      doc.about = deepMerge(
        (doc.about || {}) as Record<string, unknown>,
        dto.about as Record<string, unknown>,
      ) as SiteSettings['about'];
    }
    await doc.save();
    return this.mergeDoc(doc);
  }

  async ensureSeeded() {
    const existing = await this.model.findOne({ key: 'default' }).exec();
    if (existing) return;
    await this.model.create({
      key: 'default',
      hero: {},
      footer: {},
      about: {},
      testimonials: [],
      statistics: [],
    });
  }
}
