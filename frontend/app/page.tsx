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
import { ConsultationModal } from './components/sections/ConsultationModal';

export default function Home() {
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowConsultationForm(true)} />
        <main className="flex-grow">
          <Hero />
          <Services />
          <WhyTrustUs />
          <PricingPlans />
          <Statistics />
          <CallToAction />
        </main>
        <Footer />
      </div>

      <ConsultationModal open={showConsultationForm} onClose={() => setShowConsultationForm(false)} />
    </>
  );
}
