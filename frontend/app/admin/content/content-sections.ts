import type { ContentSummaryCounts } from '../../lib/site-content-types';

export type ContentCardDef = {
  id: string;
  title: string;
  description: string;
  href: string;
  countKey?: keyof ContentSummaryCounts;
};

export const CONTENT_SECTION_CARDS: ContentCardDef[] = [
  {
    id: 'hero',
    title: 'Hero & homepage',
    description: 'Greeting, headline, intro copy, WhatsApp strip, and hero image.',
    href: '/admin/content/hero',
  },
  {
    id: 'about',
    title: 'About page',
    description: 'Hero, story, “Why trust us” features, image, and core values on /about-us.',
    href: '/admin/content/about',
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Service cards, descriptions, perks, and booking numbers on the public site.',
    href: '/admin/services',
    countKey: 'services',
  },
  {
    id: 'footer',
    title: 'Footer & brand',
    description: 'Footer tagline, address, phone, and email (footer + contact page).',
    href: '/admin/content/footer',
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Homepage testimonial quotes, authors, and ratings.',
    href: '/admin/content/testimonials',
  },
  {
    id: 'statistics',
    title: 'Statistics strip',
    description: 'Numbers and labels in the “Years of experience” section.',
    href: '/admin/content/statistics',
  },
  {
    id: 'core-values',
    title: 'Core values (legacy API)',
    description: 'Separate Mongo collection (read-only preview). The About page “Core values” cards are edited under About page.',
    href: '/admin/content/core-values',
    countKey: 'coreValues',
  },
  {
    id: 'leadership',
    title: 'Leadership team',
    description: 'Leadership entries linked to doctor profiles.',
    href: '/admin/content/leadership',
    countKey: 'leadership',
  },
  {
    id: 'social',
    title: 'Social links',
    description: 'Footer social icons and outbound links.',
    href: '/admin/content/social',
    countKey: 'socialMedia',
  },
];
