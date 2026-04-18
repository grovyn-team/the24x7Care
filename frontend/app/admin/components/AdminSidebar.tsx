'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Layers, MessageSquare, Stethoscope, Users, UsersRound } from 'lucide-react';

const navigation: { name: string; href: string; icon: LucideIcon }[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/admin/content', icon: Layers },
  { name: 'Doctors', href: '/admin/users', icon: Users },
  { name: 'Patients', href: '/admin/patients', icon: UsersRound },
  { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  { name: 'Services', href: '/admin/services', icon: Stethoscope },
];

function isActiveNavPath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="/the247_care_logo.svg"
              alt="The24x7Care"
              className="h-8 lg:h-10 w-auto"
            />
            <span className="font-semibold text-gray-900 text-sm lg:text-base">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = isActiveNavPath(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={2} aria-hidden />
                <span className="font-medium text-sm lg:text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
