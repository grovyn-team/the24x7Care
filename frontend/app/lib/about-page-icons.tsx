import {
  Award,
  Calendar,
  CircleDollarSign,
  Heart,
  Lock,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react';

export type WhyTrustIconKey = 'shield' | 'calendar' | 'user' | 'currency' | 'lock';
export type CoreValueIconKey = 'heart' | 'award' | 'shield-check';

const whyClass = 'w-8 h-8 text-white';

export function WhyTrustFeatureIcon({ iconKey }: { iconKey: string }) {
  switch (iconKey as WhyTrustIconKey) {
    case 'calendar':
      return <Calendar className={whyClass} strokeWidth={2} aria-hidden />;
    case 'user':
      return <User className={whyClass} strokeWidth={2} aria-hidden />;
    case 'currency':
      return <CircleDollarSign className={whyClass} strokeWidth={2} aria-hidden />;
    case 'lock':
      return <Lock className={whyClass} strokeWidth={2} aria-hidden />;
    case 'shield':
    default:
      return <Shield className={whyClass} strokeWidth={2} aria-hidden />;
  }
}

const coreClass = 'w-12 h-12 text-teal-700';

export function CoreValueIcon({ iconKey }: { iconKey: string }) {
  switch (iconKey as CoreValueIconKey) {
    case 'award':
      return <Award className={coreClass} strokeWidth={2} aria-hidden />;
    case 'shield-check':
      return <ShieldCheck className={coreClass} strokeWidth={2} aria-hidden />;
    case 'heart':
    default:
      return <Heart className={coreClass} strokeWidth={2} aria-hidden />;
  }
}

export const WHY_TRUST_ICON_OPTIONS: { value: WhyTrustIconKey; label: string }[] = [
  { value: 'shield', label: 'Shield (vetted / quality)' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'user', label: 'Person' },
  { value: 'currency', label: 'Currency / value' },
  { value: 'lock', label: 'Lock (privacy)' },
];

export const CORE_VALUE_ICON_OPTIONS: { value: CoreValueIconKey; label: string }[] = [
  { value: 'heart', label: 'Heart' },
  { value: 'award', label: 'Award / excellence' },
  { value: 'shield-check', label: 'Shield (integrity)' },
];
