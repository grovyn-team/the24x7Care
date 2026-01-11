'use client';

import { useState } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { Statistics } from './components/sections/Statistics';
import { Services } from './components/sections/Services';
import { WhyTrustUs } from './components/sections/WhyTrustUs';
import { PricingPlans } from './components/sections/PricingPlans';
import { CallToAction } from './components/sections/CallToAction';
import { Footer } from './components/sections/Footer';
import { ConsultationForm } from './components/sections/ConsultationForm';

export default function Home() {
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowConsultationForm(true)} />
        <main className="flex-grow">
          <Hero />
          <Statistics />
          <Services />
          <WhyTrustUs />
          <PricingPlans />
          <CallToAction />
        </main>
        <Footer />
      </div>

      {/* Global Consultation Form Modal */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Schedule a Consultation</h2>
              <button
                onClick={() => setShowConsultationForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ConsultationForm onClose={() => setShowConsultationForm(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
