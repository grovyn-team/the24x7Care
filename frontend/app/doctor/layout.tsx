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

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== '/doctor/login') {
        router.push('/doctor/login');
      } else if (isAuthenticated && !isDoctor && pathname.startsWith('/doctor')) {
        router.push('/admin/dashboard');
      } else if (isAuthenticated && isDoctor && pathname === '/doctor/login') {
        router.push('/doctor/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, router, isDoctor]);

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

  if (!isAuthenticated && pathname !== '/doctor/login') {
    return null;
  }

  if (pathname === '/doctor/login') {
    return <>{children}</>;
  }

  if (isAuthenticated && !isDoctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="flex">
        <DoctorSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main className="flex-1 p-4 lg:p-6 mt-16 pb-24 lg:ml-64 lg:pb-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
