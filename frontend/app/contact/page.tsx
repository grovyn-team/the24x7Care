'use client';

import { useState } from 'react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { ConsultationForm } from '../components/sections/ConsultationForm';
import { Button } from '../components/ui/Button';

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowForm(true)} />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Have questions or ready to schedule a consultation? We&apos;re here to help. 
                  Reach out to us through any of the channels below.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Healthcare Street<br />
                    Medical District<br />
                    City, State 12345
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600 mb-2">
                    <a href="tel:+1234567890" className="hover:text-teal-700 transition-colors">
                      +1 (234) 567-890
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@the247care.com" className="hover:text-teal-700 transition-colors">
                      info@the247care.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
                </div>
              </div>

              {/* Consultation Form CTA */}
              <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Book a Free Consultation
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out our consultation form and our care coordinators will contact you 
                  within 24 hours to discuss your specific needs and answer any questions.
                </p>
                <Button variant="primary" size="lg" onClick={() => setShowForm(true)}>
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </section>

          {/* Map Section Placeholder */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg h-96 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">Map integration placeholder</p>
                    <p className="text-sm text-gray-500 mt-2">Add your preferred map service here (Google Maps, Mapbox, etc.)</p>
                  </div>
                </div>
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
