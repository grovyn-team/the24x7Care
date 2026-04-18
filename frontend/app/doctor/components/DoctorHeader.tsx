'use client';

import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DoctorHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function DoctorHeader({ onMenuToggle, isMenuOpen }: DoctorHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-50 flex h-16 w-full shrink-0 items-center justify-between bg-teal-800 px-4 text-white lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 rounded-lg hover:bg-teal-700 flex items-center justify-center transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" strokeWidth={2} aria-hidden />
          ) : (
            <Menu className="w-6 h-6" strokeWidth={2} aria-hidden />
          )}
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
          <LogOut className="w-5 h-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </header>
  );
}
