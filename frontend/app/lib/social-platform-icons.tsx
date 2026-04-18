import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AtSign,
  Bird,
  BookOpen,
  Briefcase,
  Camera,
  CircleDot,
  CirclePlay,
  Code2,
  DiscAlbum,
  Ghost,
  Link2,
  MessageCircle,
  MessageSquare,
  Music2,
  Palette,
  Phone,
  Pin,
  Radio,
  Send,
  Share2,
  Sparkles,
  Tv,
} from 'lucide-react';

export type SocialPlatformKey =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'snapchat'
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'github'
  | 'threads'
  | 'reddit'
  | 'medium'
  | 'twitch'
  | 'spotify'
  | 'line'
  | 'vimeo'
  | 'behance'
  | 'dribbble'
  | 'wechat';

function hostMatch(h: string): SocialPlatformKey | null {
  if (h.includes('instagram')) return 'instagram';
  if (h.includes('facebook.') || h === 'fb.com' || h === 'fb.me' || h.endsWith('.facebook.com')) return 'facebook';
  if (h.includes('twitter.') || h === 'x.com' || h.endsWith('.x.com')) return 'twitter';
  if (h.includes('linkedin.')) return 'linkedin';
  if (h.includes('youtube.') || h === 'youtu.be') return 'youtube';
  if (h.includes('tiktok.')) return 'tiktok';
  if (h.includes('pinterest.') || h === 'pin.it') return 'pinterest';
  if (h.includes('snapchat.')) return 'snapchat';
  if (h.includes('whatsapp.') || h === 'wa.me') return 'whatsapp';
  if (h.includes('telegram.') || h === 't.me') return 'telegram';
  if (h.includes('discord.')) return 'discord';
  if (h.includes('github.')) return 'github';
  if (h.includes('threads.')) return 'threads';
  if (h.includes('reddit.')) return 'reddit';
  if (h === 'medium.com' || h.endsWith('.medium.com')) return 'medium';
  if (h.includes('twitch.')) return 'twitch';
  if (h.includes('spotify.')) return 'spotify';
  if (h.includes('line.me')) return 'line';
  if (h.includes('vimeo.')) return 'vimeo';
  if (h.includes('behance.')) return 'behance';
  if (h.includes('dribbble.')) return 'dribbble';
  if (h.includes('wechat') || h.includes('weixin')) return 'wechat';
  return null;
}

const LABEL_ORDER: { key: SocialPlatformKey; test: (n: string) => boolean }[] = [
  { key: 'instagram', test: (n) => n.includes('instagram') || /\binsta\b/.test(n) },
  { key: 'facebook', test: (n) => n.includes('facebook') || /\bfb\b/.test(n) },
  { key: 'twitter', test: (n) => n.includes('twitter') || n === 'x' || /\bx\s*\(/.test(n) },
  { key: 'linkedin', test: (n) => n.includes('linkedin') },
  { key: 'youtube', test: (n) => n.includes('youtube') || /\byt\b/.test(n) },
  { key: 'tiktok', test: (n) => n.includes('tiktok') || n.includes('tik tok') },
  { key: 'pinterest', test: (n) => n.includes('pinterest') },
  { key: 'snapchat', test: (n) => n.includes('snapchat') || n.includes('snap chat') },
  { key: 'whatsapp', test: (n) => n.includes('whatsapp') || n.includes('whats app') },
  { key: 'telegram', test: (n) => n.includes('telegram') },
  { key: 'discord', test: (n) => n.includes('discord') },
  { key: 'github', test: (n) => n.includes('github') || n.includes('git hub') },
  { key: 'threads', test: (n) => n.includes('threads') },
  { key: 'reddit', test: (n) => n.includes('reddit') },
  { key: 'medium', test: (n) => n === 'medium' || n.includes('medium.com') },
  { key: 'twitch', test: (n) => n.includes('twitch') },
  { key: 'spotify', test: (n) => n.includes('spotify') },
  { key: 'line', test: (n) => n === 'line' || /(^|\s)line(\s|$)/.test(n) },
  { key: 'vimeo', test: (n) => n.includes('vimeo') },
  { key: 'behance', test: (n) => n.includes('behance') },
  { key: 'dribbble', test: (n) => n.includes('dribbble') },
  { key: 'wechat', test: (n) => n.includes('wechat') || n.includes('weixin') },
];

export function resolveSocialPlatformKey(label: string, href?: string): SocialPlatformKey | null {
  if (href) {
    try {
      const host = new URL(href).hostname.replace(/^www\./, '').toLowerCase();
      const fromHost = hostMatch(host);
      if (fromHost) return fromHost;
    } catch {}
  }
  const n = label.toLowerCase().trim();
  for (const { key, test } of LABEL_ORDER) {
    if (test(n)) return key;
  }
  return null;
}

const socialIconByPlatform: Record<SocialPlatformKey, LucideIcon> = {
  facebook: Share2,
  instagram: Camera,
  twitter: Bird,
  linkedin: Briefcase,
  youtube: CirclePlay,
  tiktok: Music2,
  pinterest: Pin,
  snapchat: Ghost,
  whatsapp: Phone,
  telegram: Send,
  discord: MessageCircle,
  github: Code2,
  threads: AtSign,
  reddit: CircleDot,
  medium: BookOpen,
  twitch: Radio,
  spotify: DiscAlbum,
  line: MessageSquare,
  vimeo: Tv,
  behance: Palette,
  dribbble: Sparkles,
  wechat: MessageSquare,
};

export function SocialPlatformIcon({ platform, className = 'w-6 h-6' }: { platform: SocialPlatformKey; className?: string }) {
  const Icon = socialIconByPlatform[platform];
  return <Icon className={className} strokeWidth={2} aria-hidden />;
}

export function GenericSocialIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <Link2 className={className} strokeWidth={2} aria-hidden />;
}
