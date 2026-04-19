'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import DoctorSidebar from './components/DoctorSidebar';
import DoctorHeader from './components/DoctorHeader';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user, isDoctor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isPublicDoctorAuth =
    pathname === '/doctor/login' || pathname === '/doctor/forgot-password';

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isPublicDoctorAuth) {
        router.push('/doctor/login');
      } else if (isAuthenticated && !isDoctor && pathname.startsWith('/doctor')) {
        router.push('/admin/dashboard');
      } else if (isAuthenticated && isDoctor && isPublicDoctorAuth) {
        router.push('/doctor/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, router, isDoctor, isPublicDoctorAuth]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicDoctorAuth) {
    return null;
  }

  if (isPublicDoctorAuth) {
    return <>{children}</>;
  }

  if (isAuthenticated && !isDoctor) {
    return null;
  }

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gray-50">
      <DoctorHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="relative flex min-h-0 flex-1">
        <DoctorSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main className="min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain p-4 pb-24 lg:ml-64 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
