'use client';

import { useState } from 'react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { Statistics } from '../components/sections/Statistics';
import { WhyTrustUs } from '../components/sections/WhyTrustUs';
import { TestimonialsCarousel } from '../components/sections/TestimonialsCarousel';
import { ConsultationModal } from '../components/sections/ConsultationModal';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { CoreValueIcon } from '../lib/about-page-icons';

export default function AboutUsPage() {
  const [showForm, setShowForm] = useState(false);
  const { about } = useSiteSettings();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowForm(true)} />
        <main className="flex-grow">
          <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">{about.heroTitle}</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">{about.heroIntro}</p>
              </div>
            </div>
          </section>

          <Statistics />

          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">{about.storyHeading}</h2>
                <div className="prose prose-lg mx-auto text-gray-600 space-y-4">
                  <p>{about.storyParagraph1}</p>
                  <p>{about.storyParagraph2}</p>
                  <p>{about.storyParagraph3}</p>
                </div>
              </div>
            </div>
          </section>

          <WhyTrustUs />

          <TestimonialsCarousel />

          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{about.coreValuesHeading}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{about.coreValuesSubheading}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {about.coreValues.map((value, index) => (
                  <div
                    key={`${value.title}-${index}`}
                    className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-4">
                      <CoreValueIcon iconKey={value.iconKey} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <ConsultationModal open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
