'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

interface HeaderProps {
  onBookVisitClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookVisitClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/care-plans', label: 'Care Plans' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-100">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 md:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/the247_care_logo.svg"
              alt="The24x7Care Logo"
              width={40}
              height={40}
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <span className="text-lg md:text-xl font-bold text-gray-900 whitespace-nowrap">The24x7Care</span>
          </Link>

          {/* Desktop Navigation - Show from md breakpoint (768px) */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-6 xl:space-x-8 flex-1 justify-center mx-2 lg:mx-4 min-w-0">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium transition-colors whitespace-nowrap text-xs md:text-sm lg:text-base ${
                    active
                      ? 'text-teal-700 font-semibold'
                      : 'text-gray-700 hover:text-teal-700'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block flex-shrink-0 ml-2 lg:ml-4">
            <Button 
              variant="primary" 
              size="sm" 
              className="text-xs lg:text-sm px-2 md:px-3 lg:px-4 py-1.5 md:py-2 whitespace-nowrap" 
              onClick={onBookVisitClick}
            >
              <span className="hidden xl:inline">Book Home Visit</span>
              <span className="xl:hidden">Book Visit</span>
            </Button>
          </div>

          {/* Mobile Menu Button - Only show below md (768px) */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Only show below md (768px) */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                    active
                      ? 'text-teal-700 bg-teal-50 font-semibold border-l-4 border-teal-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Button variant="primary" size="md" className="w-full" onClick={onBookVisitClick}>
                Book Home Visit
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
