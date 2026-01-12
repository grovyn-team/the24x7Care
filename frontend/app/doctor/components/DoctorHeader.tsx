'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DoctorHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function DoctorHeader({ onMenuToggle, isMenuOpen }: DoctorHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-teal-800 text-white h-16 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 rounded-lg hover:bg-teal-700 flex items-center justify-center transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <h1 className="text-base lg:text-lg font-semibold">The24x7Care</h1>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <span className="hidden sm:inline text-xs lg:text-sm">{user?.email}</span>
        <button
          onClick={logout}
          className="w-10 h-10 rounded-full bg-teal-700 hover:bg-teal-600 flex items-center justify-center transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
