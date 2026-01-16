'use client';

import { useState } from 'react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { PricingPlans } from '../components/sections/PricingPlans';
import { ConsultationForm } from '../components/sections/ConsultationForm';

export default function CarePlansPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowForm(true)} />
      <main className="flex-grow">
        <PricingPlans />
        
        {/* Additional Information Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {[
                  {
                    question: 'What happens if I don\'t get a response?',
                    answer: 'We understand that timely communication is crucial. If you don\'t receive a response within 24 hours of submitting your enquiry, please contact us directly at +91 79747 53889 or reach out via WhatsApp. Our support team is available 24/7 to ensure you receive immediate assistance and follow-up on your queries.',
                  },
                  {
                    question: 'Do you have a refund policy?',
                    answer: 'Yes, we have a transparent refund policy. If you are not satisfied with our services or need to cancel your consultation before it begins, we offer full refunds within 48 hours of payment. For services already rendered, refunds are evaluated on a case-by-case basis. Please contact our support team for refund requests, and we will process them within 5-7 business days.',
                  },
                  {
                    question: 'Will you be able to resolve my issue?',
                    answer: 'Our team of experienced medical professionals and care coordinators is dedicated to addressing your healthcare needs comprehensively. While we cannot guarantee specific medical outcomes, we ensure that every enquiry receives proper attention, appropriate medical consultation, and a personalized care plan. We work with certified doctors and specialists across various fields to provide the best possible solutions for your health concerns.',
                  },
                  {
                    question: 'Is my consultation private with doctor?',
                    answer: 'Absolutely. Patient confidentiality is one of our top priorities. All consultations are conducted in a completely private and secure environment. We adhere to strict HIPAA-compliant privacy standards, and your personal information and medical discussions are never shared with unauthorized parties. Whether it\'s an in-person consultation, video call, audio call, or chat, your privacy is guaranteed at every step.',
                  },
                  {
                    question: 'Who are the consulting doctors?',
                    answer: 'Our consulting doctors are highly qualified, licensed medical professionals with years of experience in their respective specializations. They include board-certified specialists such as Dermatologists, Pulmonologists, Nephrologists, Dentologists, and general practitioners. All our doctors undergo rigorous credential verification and maintain active licenses with medical councils. You can request information about your assigned doctor\'s qualifications and experience before your consultation.',
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
