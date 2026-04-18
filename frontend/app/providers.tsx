'use client';

import { AuthProvider } from './contexts/AuthContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { ToastProvider } from './contexts/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <SiteSettingsProvider>{children}</SiteSettingsProvider>
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
