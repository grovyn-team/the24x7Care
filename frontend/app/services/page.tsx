'use client';

import { useState } from 'react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { Services } from '../components/sections/Services';
import { ConsultationForm } from '../components/sections/ConsultationForm';

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowForm(true)} />
      <main className="flex-grow">
        <Services />
        
        {/* Additional Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Physiotherapy',
                  description: 'Rehabilitative exercises designed to restore mobility, strength, and balance safely in the comfort of your home, utilizing portable equipment.',
                  icon: (
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
                {
                  title: 'Palliative Care',
                  description: 'Compassionate end-of-life care focusing on comfort, pain management, and emotional support for patients and their families.',
                  icon: (
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Chronic Disease Management',
                  description: 'Ongoing care and monitoring for chronic conditions such as diabetes, hypertension, and heart disease with personalized care plans.',
                  icon: (
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
              ].map((service, index) => (
                <div key={index} className="bg-teal-800 rounded-xl p-8 hover:shadow-lg transition-shadow border border-teal-700 group">
                  <div className="mb-5 p-4 bg-white/10 rounded-lg w-fit border border-white/20 group-hover:border-white/40 group-hover:bg-white/15 transition-colors duration-200">
                    <div className="text-white drop-shadow-sm">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-teal-100">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      </div>

      {/* Consultation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Schedule a Consultation</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ConsultationForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
