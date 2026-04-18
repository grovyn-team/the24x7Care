'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import type { SiteAbout, SiteAboutCoreValue, SiteAboutWhyTrustFeature } from '../../../lib/site-content-types';
import { CORE_VALUE_ICON_OPTIONS, WHY_TRUST_ICON_OPTIONS } from '../../../lib/about-page-icons';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';

const input =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15';

const btnAdd =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-teal-800 shadow-sm transition-colors hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-600/25';

const btnRemove =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/25';

const emptyWhyFeature = (): SiteAboutWhyTrustFeature => ({
  title: '',
  description: '',
  iconKey: 'shield',
});

const emptyCoreValue = (): SiteAboutCoreValue => ({
  title: '',
  description: '',
  iconKey: 'heart',
});

export default function ContentAboutPage() {
  const [about, setAbout] = useState<SiteAbout | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSiteSettingsAdmin().then((b) => setAbout(b.about));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.updateSiteSettings({
        about: {
          ...about,
          whyTrustFeatures: about.whyTrustFeatures.map((f) => ({
            title: f.title.trim(),
            description: f.description.trim(),
            iconKey: f.iconKey,
          })),
          coreValues: about.coreValues.map((c) => ({
            title: c.title.trim(),
            description: c.description.trim(),
            iconKey: c.iconKey,
          })),
        },
      });
      setMsg('About page saved.');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!about) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">Loading…</div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <AdminBreadcrumbs
        items={[{ label: 'Content management', href: '/admin/content' }, { label: 'About page' }]}
      />

      <header className="border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900">About page</h1>
        <p className="mt-1 text-gray-600">
          Public <code className="text-xs">/about-us</code> copy: hero, story, “Why trust us”, and core values. Rotating
          quotes in that section use{' '}
          <a href="/admin/content/testimonials" className="text-teal-700 hover:underline">
            Testimonials
          </a>
          .
        </p>
      </header>

      {msg && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-900">{msg}</div>
      )}

      <form onSubmit={save} className="max-w-3xl space-y-10">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Hero</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Title</label>
            <input className={input} value={about.heroTitle} onChange={(e) => setAbout({ ...about, heroTitle: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Intro</label>
            <textarea className={input} rows={4} value={about.heroIntro} onChange={(e) => setAbout({ ...about, heroIntro: e.target.value })} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Our story</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Section heading</label>
            <input className={input} value={about.storyHeading} onChange={(e) => setAbout({ ...about, storyHeading: e.target.value })} />
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Paragraph {n}</label>
              <textarea
                className={input}
                rows={n === 1 ? 4 : 3}
                value={n === 1 ? about.storyParagraph1 : n === 2 ? about.storyParagraph2 : about.storyParagraph3}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    ...(n === 1
                      ? { storyParagraph1: e.target.value }
                      : n === 2
                        ? { storyParagraph2: e.target.value }
                        : { storyParagraph3: e.target.value }),
                  })
                }
              />
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Why families trust us</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Heading</label>
            <input className={input} value={about.whyTrustHeading} onChange={(e) => setAbout({ ...about, whyTrustHeading: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Subheading</label>
            <textarea className={input} rows={3} value={about.whyTrustSubheading} onChange={(e) => setAbout({ ...about, whyTrustSubheading: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Side image URL (optional)</label>
              <input
                className={input}
                value={about.whyTrustImageUrl}
                onChange={(e) => setAbout({ ...about, whyTrustImageUrl: e.target.value })}
                placeholder="https://… or leave empty for placeholder"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Image alt text</label>
              <input className={input} value={about.whyTrustImageAlt} onChange={(e) => setAbout({ ...about, whyTrustImageAlt: e.target.value })} />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase text-gray-500">Feature rows</span>
              <button
                type="button"
                className={btnAdd}
                onClick={() => setAbout({ ...about, whyTrustFeatures: [...about.whyTrustFeatures, emptyWhyFeature()] })}
              >
                <span className="text-base leading-none text-teal-700">+</span>
                Add row
              </button>
            </div>
            {about.whyTrustFeatures.map((row, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/90 px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-700">Feature {i + 1}</span>
                  {about.whyTrustFeatures.length > 1 ? (
                    <button
                      type="button"
                      className={btnRemove}
                      aria-label={`Remove feature ${i + 1}`}
                      onClick={() =>
                        setAbout({
                          ...about,
                          whyTrustFeatures: about.whyTrustFeatures.filter((_, j) => j !== i),
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
                      Remove
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">At least one row required</span>
                  )}
                </div>
                <div className="space-y-3 p-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Icon</label>
                    <select
                      className={input}
                      value={row.iconKey}
                      onChange={(e) => {
                        const next = [...about.whyTrustFeatures];
                        next[i] = { ...row, iconKey: e.target.value };
                        setAbout({ ...about, whyTrustFeatures: next });
                      }}
                    >
                      {WHY_TRUST_ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className={input}
                    placeholder="Title"
                    value={row.title}
                    onChange={(e) => {
                      const next = [...about.whyTrustFeatures];
                      next[i] = { ...row, title: e.target.value };
                      setAbout({ ...about, whyTrustFeatures: next });
                    }}
                  />
                  <textarea
                    className={input}
                    rows={2}
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => {
                      const next = [...about.whyTrustFeatures];
                      next[i] = { ...row, description: e.target.value };
                      setAbout({ ...about, whyTrustFeatures: next });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Core values (lower section)</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Heading</label>
            <input className={input} value={about.coreValuesHeading} onChange={(e) => setAbout({ ...about, coreValuesHeading: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Subheading</label>
            <textarea className={input} rows={2} value={about.coreValuesSubheading} onChange={(e) => setAbout({ ...about, coreValuesSubheading: e.target.value })} />
          </div>
          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase text-gray-500">Value cards</span>
              <button
                type="button"
                className={btnAdd}
                onClick={() => setAbout({ ...about, coreValues: [...about.coreValues, emptyCoreValue()] })}
              >
                <span className="text-base leading-none text-teal-700">+</span>
                Add card
              </button>
            </div>
            {about.coreValues.map((row, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/90 px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-700">Card {i + 1}</span>
                  {about.coreValues.length > 1 ? (
                    <button
                      type="button"
                      className={btnRemove}
                      aria-label={`Remove value card ${i + 1}`}
                      onClick={() =>
                        setAbout({
                          ...about,
                          coreValues: about.coreValues.filter((_, j) => j !== i),
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
                      Remove
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">At least one card required</span>
                  )}
                </div>
                <div className="space-y-3 p-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Icon</label>
                    <select
                      className={input}
                      value={row.iconKey}
                      onChange={(e) => {
                        const next = [...about.coreValues];
                        next[i] = { ...row, iconKey: e.target.value };
                        setAbout({ ...about, coreValues: next });
                      }}
                    >
                      {CORE_VALUE_ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className={input}
                    placeholder="Title"
                    value={row.title}
                    onChange={(e) => {
                      const next = [...about.coreValues];
                      next[i] = { ...row, title: e.target.value };
                      setAbout({ ...about, coreValues: next });
                    }}
                  />
                  <textarea
                    className={input}
                    rows={3}
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => {
                      const next = [...about.coreValues];
                      next[i] = { ...row, description: e.target.value };
                      setAbout({ ...about, coreValues: next });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" disabled={saving} className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
}
