'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Info, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastApi = {
  push: (message: string, type?: ToastType, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
  warning: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const typeStyles: Record<ToastType, string> = {
  success:
    'border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-white text-emerald-950 shadow-emerald-900/10 ring-emerald-700/10',
  error:
    'border-red-200/90 bg-gradient-to-br from-red-50 to-white text-red-950 shadow-red-900/10 ring-red-800/10',
  info: 'border-slate-200/90 bg-gradient-to-br from-slate-50 to-white text-slate-900 shadow-slate-900/10 ring-slate-800/8',
  warning:
    'border-amber-200/90 bg-gradient-to-br from-amber-50 to-white text-amber-950 shadow-amber-900/10 ring-amber-800/10',
};

const iconByType: Record<ToastType, React.ReactNode> = {
  success: <Check className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />,
  error: <XCircle className="h-5 w-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />,
  info: <Info className="h-5 w-5 shrink-0 text-slate-600" strokeWidth={2} aria-hidden />,
  warning: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" strokeWidth={2} aria-hidden />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, type: ToastType = 'info', durationMs = 5200) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      if (durationMs > 0) {
        window.setTimeout(() => remove(id), durationMs);
      }
    },
    [remove],
  );

  const value = useMemo<ToastApi>(
    () => ({
      push,
      success: (m, d) => push(m, 'success', d),
      error: (m, d) => push(m, 'error', d),
      info: (m, d) => push(m, 'info', d),
      warning: (m, d) => push(m, 'warning', d),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex flex-col items-stretch gap-2 p-3 pt-[4.5rem] sm:items-end sm:p-4 sm:pt-20"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className={`pointer-events-auto mx-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ring-1 sm:mx-0 ${typeStyles[t.type]}`}
              role="status"
            >
              {iconByType[t.type]}
              <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="-m-1 shrink-0 rounded-lg p-1.5 text-current opacity-60 transition hover:bg-black/5 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
