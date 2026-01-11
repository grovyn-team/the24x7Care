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
                    question: 'Can I switch between care plans?',
                    answer: 'Yes, you can upgrade, downgrade, or modify your care plan at any time based on your changing needs. Our care coordinators will help you make the transition seamless.',
                  },
                  {
                    question: 'Are there any long-term commitments?',
                    answer: 'No, we offer flexible scheduling with no long-term contracts required. You can use our services on a weekly, monthly, or as-needed basis.',
                  },
                  {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, debit cards, insurance plans, and offer payment plans for extended care services. Payment receipts are provided after each transaction.',
                  },
                  {
                    question: 'Do you accept insurance?',
                    answer: 'Yes, we work with most major insurance providers. Our team will help you verify your coverage and assist with all necessary paperwork.',
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
