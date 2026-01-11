'use client';

import { useState } from 'react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { Statistics } from '../components/sections/Statistics';
import { WhyTrustUs } from '../components/sections/WhyTrustUs';
import { TestimonialsCarousel } from '../components/sections/TestimonialsCarousel';
import { ConsultationForm } from '../components/sections/ConsultationForm';

export default function AboutUsPage() {
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
                About The24x7Care
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We are dedicated to providing exceptional home healthcare services with a focus on 
                compassion, integrity, and clinical excellence. Our mission is to bring quality 
                medical care directly to your home, ensuring comfort and peace of mind for you and your loved ones.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <Statistics />

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg mx-auto text-gray-600 space-y-4">
                <p>
                  Founded with a vision to revolutionize home healthcare, The24x7Care has been serving 
                  families across the nation for over 15 years. What started as a small team of dedicated 
                  healthcare professionals has grown into a trusted network of over 500 certified caregivers, 
                  nurses, and medical specialists.
                </p>
                <p>
                  Our commitment extends beyond medical care. We believe in building lasting relationships 
                  with our patients and their families, understanding that healthcare is as much about 
                  emotional support as it is about physical well-being.
                </p>
                <p>
                  Every member of our team undergoes rigorous screening and continuous training to ensure 
                  the highest standards of care. We match our caregivers not just based on medical 
                  qualifications, but also on personality, communication style, and shared values.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Trust Us Section */}
        <WhyTrustUs />

        {/* Testimonials */}
        <TestimonialsCarousel />

        {/* Our Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These fundamental principles guide everything we do and shape how we care for our patients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: 'Compassion',
                  description: 'We treat every patient with dignity, respect, and genuine care, understanding that each person\'s journey is unique.',
                  icon: (
                    <svg className="w-12 h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Excellence',
                  description: 'We maintain the highest standards of medical care through continuous training, certification, and quality assurance.',
                  icon: (
                    <svg className="w-12 h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                },
                {
                  title: 'Integrity',
                  description: 'We conduct our business with honesty, transparency, and ethical practices, earning the trust of patients and families.',
                  icon: (
                    <svg className="w-12 h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
              ].map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">{value.icon}</div>
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
