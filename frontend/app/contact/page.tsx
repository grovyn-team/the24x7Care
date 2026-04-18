'use client';

import { useState } from 'react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { ConsultationModal } from '../components/sections/ConsultationModal';
import { Button } from '../components/ui/Button';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { phoneToTelHref } from '../lib/contact-format';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);
  const { footer } = useSiteSettings();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowForm(true)} />
        <main className="flex-grow">
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

          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-teal-700" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">
                    {footer.addressLine1}
                    <br />
                    {footer.addressLine2}
                    {footer.addressLine3?.trim() ? (
                      <>
                        <br />
                        {footer.addressLine3.trim()}
                      </>
                    ) : null}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-teal-700" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600 mb-2">
                    <a href={phoneToTelHref(footer.contactPhone)} className="hover:text-teal-700 transition-colors">
                      {footer.contactPhone}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-teal-700" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">
                    <a href={`mailto:${footer.contactEmail}`} className="hover:text-teal-700 transition-colors">
                      {footer.contactEmail}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
                </div>
              </div>

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

          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg h-96 w-full">
                  <iframe
                    title="Map - Raipur, Chhattisgarh"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.54141374431!2d81.56064599999999!3d21.2513844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dddd221de241%3A0xad264d89c9850bfa!2sRaipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">Raipur, Chhattisgarh</p>
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
