'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Apple,
  ArrowRight,
  Baby,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  Check,
  FileText,
  FlaskConical,
  Heart,
  Home,
  Lightbulb,
  Package,
  Smile,
  User,
  Zap,
} from 'lucide-react';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { ConsultationModal } from '../components/sections/ConsultationModal';
import { api } from '../lib/api';

interface Service {
  _id?: string;
  title: string;
  description: string;
  perks?: string[];
  book_via?: string;
}

const serviceIconByTitle: Record<string, LucideIcon> = {
  Physiotherapy: Zap,
  'Ayurveda & Wellness': BookOpen,
  Homeopathy: Lightbulb,
  'Doctor Consultation': User,
  'Home Care Services': Home,
  'Nurse/Caretaker': Heart,
  'Nutrition & Diet Consultation': Apple,
  'Lab Test (online booking)': FileText,
  'Lab Test at home': FileText,
  'Mental Wellness': Brain,
  'Medicines home delivery': Package,
  'Jobs in Healthcare': Briefcase,
  'Morning Powder': FlaskConical,
  'Lab Reports': FileText,
  Appointments: Calendar,
  'Sickle Cell Care': Heart,
  'Diabetic Care': Activity,
  'Skin Hair Beauty & Health': Smile,
  'Maternity & Child Care': Baby,
};

function ServiceIcon({ title }: { title: string }) {
  const Icon = serviceIconByTitle[title] || Heart;
  return <Icon className="w-12 h-12 text-white" strokeWidth={2.5} aria-hidden />;
}

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
                                <ServiceIcon title={service.title} />
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
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} aria-hidden />
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
                              <ArrowRight
                                className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                                strokeWidth={2.5}
                                aria-hidden
                              />
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
                                <ServiceIcon title={service.title} />
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
                              <ArrowRight
                                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                                strokeWidth={2.5}
                                aria-hidden
                              />
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

      <ConsultationModal open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
