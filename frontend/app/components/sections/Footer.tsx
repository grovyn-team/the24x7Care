'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { contentApi, type SocialMediaItem } from '../../lib/api';
import { phoneToTelHref } from '../../lib/contact-format';
import {
  GenericSocialIcon,
  resolveSocialPlatformKey,
  SocialPlatformIcon,
} from '../../lib/social-platform-icons';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { footer } = useSiteSettings();
  const [socialLinks, setSocialLinks] = useState<SocialMediaItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    contentApi
      .getSocialMedia()
      .then((data) => {
        if (!cancelled) setSocialLinks(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setSocialLinks([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const servicesLinks = [
    { href: '/services', label: 'Doctor Consultation' },
    { href: '/services', label: 'Home Care Services' },
    { href: '/services', label: 'Nurse/Caretaker' },
    { href: '/services', label: 'Physiotherapy' },
    { href: '/services', label: 'Lab Test at home' },
  ];

  const companyLinks = [
    { href: '/about-us', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/patient-rights', label: 'Patient Rights & Responsibilities' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/the247_care_logo.svg"
                alt="The24x7Care Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-gray-900">The24x7Care</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">{footer.tagline}</p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((item) => {
                  const iconUrl = item.icon_url?.trim();
                  const platform = resolveSocialPlatformKey(item.title, item.href);
                  return (
                    <a
                      key={item._id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-teal-700 transition-colors"
                    >
                      <span className="sr-only">{item.title}</span>
                      {iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={iconUrl} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                      ) : platform ? (
                        <SocialPlatformIcon platform={platform} className="w-6 h-6" />
                      ) : (
                        <GenericSocialIcon className="w-6 h-6" />
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">Services</h3>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-teal-700 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-teal-700 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-700" strokeWidth={2} />
                <span className="text-gray-600 text-sm">
                  {footer.addressLine1}
                  <br />
                  {footer.addressLine2}
                  {footer.addressLine3?.trim() ? (
                    <>
                      <br />
                      {footer.addressLine3.trim()}
                    </>
                  ) : null}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-teal-700" strokeWidth={2} />
                <a
                  href={phoneToTelHref(footer.contactPhone)}
                  className="text-gray-600 hover:text-teal-700 text-sm transition-colors"
                >
                  {footer.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-teal-700" strokeWidth={2} />
                <a
                  href={`mailto:${footer.contactEmail}`}
                  className="text-gray-600 hover:text-teal-700 text-sm transition-colors"
                >
                  {footer.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} The247Care. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-teal-700 text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-teal-700 text-sm transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-teal-700 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
