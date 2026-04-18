'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (isAuthenticated && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

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

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gray-50">
      <AdminHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="relative flex min-h-0 flex-1">
        <AdminSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main className="min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain p-4 pb-24 lg:ml-64 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
