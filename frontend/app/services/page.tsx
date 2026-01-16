'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { ConsultationForm } from '../components/sections/ConsultationForm';
import { api } from '../lib/api';

interface Service {
  _id?: string;
  title: string;
  description: string;
  perks?: string[];
  book_via?: string;
}

const getServiceIcon = (title: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Physiotherapy': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    'Ayurveda & Wellness': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    'Homeopathy': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    'Doctor Consultation': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'Home Care Services': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    'Nurse/Caretaker': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'Nutrition & Diet Consultation': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    'Lab Test (online booking)': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'Lab Test at home': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'Mental Wellness': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    'Medicines home delivery': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'Jobs in Healthcare': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'Morning Powder': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'Lab Reports': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'Appointments': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'Sickle Cell Care': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'Diabetic Care': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'Skin Hair Beauty & Health': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Maternity & Child Care': (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };
  return iconMap[title] || (
    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
};

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get<Service[]>('/services');
        const services = data || [];
        setAllServices(services);
        
        const topServices = ['Doctor Consultation', 'Home Care Services', 'Nurse/Caretaker'];
        const featured = services.filter(s => topServices.includes(s.title));
        setFeaturedServices(featured.length === 3 ? featured : services.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setAllServices([]);
        setFeaturedServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onBookVisitClick={() => setShowForm(true)} />
        <main className="flex-grow">
          <section className="relative bg-gradient-to-br from-teal-50 via-white to-teal-50 py-20 sm:py-24 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <span className="inline-block text-xs font-semibold text-teal-700 uppercase tracking-wider bg-teal-100 px-4 py-2 rounded-full mb-4">
                    What We Offer
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                >
                  Our Healthcare Services
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
                >
                  Comprehensive medical care delivered to your doorstep with compassion, expertise, and personalized attention
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-700 mx-auto rounded-full"
                ></motion.div>
              </div>
            </div>
          </section>

          {!loading && featuredServices.length > 0 && (
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                  >
                    <span className="inline-block text-xs font-semibold text-teal-700 uppercase tracking-wider mb-4 bg-teal-100 px-5 py-2 rounded-full shadow-sm">
                      Featured Services
                    </span>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {featuredServices.map((service, index) => (
                      <motion.div
                        key={service._id || `featured-${index}`}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
                        whileHover={{ y: -12, scale: 1.02 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
                        <div className="bg-gradient-to-br from-teal-800 via-teal-800 to-teal-900 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-teal-700/50 flex flex-col h-full relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-700/20 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
                          
                          <div className="relative z-10">
                            <div className="mb-6 p-5 bg-white/10 backdrop-blur-sm rounded-2xl w-fit border border-white/30 group-hover:bg-white/20 group-hover:border-white/50 group-hover:scale-110 transition-all duration-500 shadow-lg">
                              <div className="text-white">
                                {getServiceIcon(service.title)}
                              </div>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-5 group-hover:text-teal-200 transition-colors duration-300 leading-tight">
                              {service.title}
                            </h3>
                            <p className="text-teal-100 mb-6 flex-grow leading-relaxed text-base lg:text-lg">
                              {service.description}
                            </p>
                            {service.perks && service.perks.length > 0 && (
                              <ul className="mb-8 space-y-3">
                                {service.perks.slice(0, 3).map((perk, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 + i * 0.1 }}
                                    className="flex items-center text-teal-100 text-sm lg:text-base"
                                  >
                                    <div className="w-5 h-5 mr-3 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    {perk}
                                  </motion.li>
                                ))}
                              </ul>
                            )}
                            <button
                              onClick={() => setShowForm(true)}
                              className="mt-auto w-full bg-white text-teal-800 font-semibold py-4 px-6 rounded-xl hover:bg-teal-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 group/btn shadow-md"
                            >
                              <span>Book Now</span>
                              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                    All Our Services
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                    Explore our complete range of healthcare services designed to meet all your medical needs
                  </p>
                  <div className="w-32 h-1.5 bg-gradient-to-r from-teal-400 to-teal-700 mx-auto rounded-full"></div>
                </motion.div>

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {allServices.map((service, index) => (
                      <motion.div
                        key={service._id || `service-${index}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index % 6) * 0.05, ease: [0.4, 0, 0.2, 1] }}
                        whileHover={{ y: -8, scale: 1.03 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-teal-700 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
                        <div className="bg-teal-800 rounded-2xl p-7 hover:shadow-2xl transition-all duration-500 border border-teal-700/50 group-hover:border-teal-600 flex flex-col h-full relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-700/20 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-700"></div>
                          
                          <div className="relative z-10">
                            <div className="mb-5 p-4 bg-white/10 backdrop-blur-sm rounded-xl w-fit border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 group-hover:scale-110 transition-all duration-500">
                              <div className="text-white">
                                {getServiceIcon(service.title)}
                              </div>
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-teal-200 transition-colors duration-300 leading-tight">
                              {service.title}
                            </h3>
                            <p className="text-teal-100 mb-6 flex-grow leading-relaxed text-sm lg:text-base">
                              {service.description}
                            </p>
                            {service.perks && service.perks.length > 0 && (
                              <div className="mb-5">
                                <div className="flex flex-wrap gap-2.5">
                                  {service.perks.slice(0, 2).map((perk, i) => (
                                    <span
                                      key={i}
                                      className="inline-block bg-white/10 backdrop-blur-sm text-teal-100 text-xs lg:text-sm px-3.5 py-1.5 rounded-full border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300"
                                    >
                                      {perk}
                                    </span>
                                  ))}
                                  {service.perks.length > 2 && (
                                    <span className="inline-block bg-white/10 backdrop-blur-sm text-teal-100 text-xs lg:text-sm px-3.5 py-1.5 rounded-full border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300">
                                      +{service.perks.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => setShowForm(true)}
                              className="mt-auto w-full text-teal-200 font-semibold hover:text-white hover:bg-white/10 py-3 px-5 rounded-xl border border-white/20 hover:border-white/40 inline-flex items-center justify-center gap-2 transition-all duration-300 group/btn backdrop-blur-sm"
                            >
                              <span>Book Now</span>
                              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!loading && allServices.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">No services available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

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
