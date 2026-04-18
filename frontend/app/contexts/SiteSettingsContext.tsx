'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { contentApi } from '../lib/api';
import { CLIENT_SITE_DEFAULTS } from '../lib/site-defaults';
import type { SiteSettingsBundle } from '../lib/site-content-types';

const SiteSettingsContext = createContext<SiteSettingsBundle>(CLIENT_SITE_DEFAULTS);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [bundle, setBundle] = useState<SiteSettingsBundle>(CLIENT_SITE_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    contentApi
      .getSiteSettings()
      .then((data) => {
        if (!cancelled && data) setBundle(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteSettingsContext.Provider value={bundle}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
