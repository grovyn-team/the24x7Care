'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'neutral';
};

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const requestConfirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  const finish = useCallback((value: boolean) => {
    const r = resolveRef.current;
    resolveRef.current = null;
    setOpen(false);
    setOptions(null);
    r?.(value);
  }, []);

  const variant = options?.variant ?? 'neutral';
  const confirmLabel = options?.confirmLabel ?? 'Confirm';
  const cancelLabel = options?.cancelLabel ?? 'Cancel';

  return (
    <ConfirmContext.Provider value={requestConfirm}>
      {children}
      <AnimatePresence>
        {open && options && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Cancel"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]"
              onClick={() => finish(false)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              aria-describedby={options.description ? 'confirm-dialog-desc' : undefined}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.35)]"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={
                  variant === 'danger'
                    ? 'border-b border-red-100 bg-gradient-to-br from-red-50 via-white to-slate-50 px-6 py-5'
                    : 'border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 px-6 py-5'
                }
              >
                <h2 id="confirm-dialog-title" className="text-lg font-semibold tracking-tight text-slate-900">
                  {options.title}
                </h2>
                {options.description ? (
                  <p id="confirm-dialog-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
                    {options.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => finish(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => finish(true)}
                  className={
                    variant === 'danger'
                      ? 'rounded-xl bg-gradient-to-b from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/20 ring-1 ring-red-700/30 transition hover:from-red-500 hover:to-red-700'
                      : 'rounded-xl bg-gradient-to-b from-teal-600 to-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 ring-1 ring-teal-700/30 transition hover:from-teal-500 hover:to-teal-700'
                  }
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return ctx;
}
