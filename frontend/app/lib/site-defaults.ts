import type { SiteAbout, SiteSettingsBundle } from './site-content-types';

const DEFAULT_ABOUT: SiteAbout = {
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
      description: 'Complete privacy guaranteed for all your medical information with strict confidentiality protocols.',
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
};

export const CLIENT_SITE_DEFAULTS: SiteSettingsBundle = {
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
  about: DEFAULT_ABOUT,
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
