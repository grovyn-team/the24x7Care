export interface SiteHero {
  greetingPart1: string;
  greetingPart2: string;
  headline: string;
  paragraph1: string;
  paragraph2: string;
  busyCta: string;
  whatsappNumber: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface SiteFooter {
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  contactPhone: string;
  contactEmail: string;
}

export interface SiteTestimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatar?: string;
}

export interface SiteStat {
  value: string;
  label: string;
}

export interface SiteAboutWhyTrustFeature {
  title: string;
  description: string;
  iconKey: string;
}

export interface SiteAboutCoreValue {
  title: string;
  description: string;
  iconKey: string;
}

export interface SiteAbout {
  heroTitle: string;
  heroIntro: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  whyTrustHeading: string;
  whyTrustSubheading: string;
  whyTrustImageUrl: string;
  whyTrustImageAlt: string;
  whyTrustFeatures: SiteAboutWhyTrustFeature[];
  coreValuesHeading: string;
  coreValuesSubheading: string;
  coreValues: SiteAboutCoreValue[];
}

export interface SiteSettingsBundle {
  hero: SiteHero;
  footer: SiteFooter;
  about: SiteAbout;
  testimonials: SiteTestimonial[];
  statistics: SiteStat[];
  updatedAt?: string;
}

export interface ContentSummaryCounts {
  services: number;
  coreValues: number;
  leadership: number;
  socialMedia: number;
  doctors: number;
}
