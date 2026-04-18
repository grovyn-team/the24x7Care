'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Home, UserRound } from 'lucide-react';
import { Card } from '../ui/Card';
import { api } from '../../lib/api';

interface Service {
  _id?: string;
  title: string;
  description: string;
  perks?: string[];
  book_via?: string;
}

const getServiceIcon = (title: string) => {
  const common = 'h-10 w-10';
  const iconMap: { [key: string]: React.ReactNode } = {
    'Doctor Consultation': <UserRound className={common} strokeWidth={2.5} />,
    'Home Care Services': <Home className={common} strokeWidth={2.5} />,
    'Nurse/Caretaker': <Heart className={common} strokeWidth={2.5} />,
  };
  return iconMap[title] || <Heart className={common} strokeWidth={2.5} />;
};

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get<Service[]>('/services');
        const topServices = ['Doctor Consultation', 'Home Care Services', 'Nurse/Caretaker'];
        const filtered = (data || []).filter(s => topServices.includes(s.title));
        setServices(filtered.length === 3 ? filtered : (data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            What We Offer
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Our Home Healthcare Services
          </motion.h2>
          <motion.div
            className="w-16 h-0.5 bg-teal-700 mb-6 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.p
            className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            We bring world-class medical expertise directly to your doorstep with a commitment 
            to dignity, comfort, and personalized attention.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-800 border border-teal-700 px-6 py-2.5 rounded-lg transition-colors duration-200 hover:bg-teal-50"
            >
              View All Services
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id || index}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  hover 
                  className="flex flex-col group h-full bg-teal-800 border-teal-700"
                >
                <motion.div
                  className="mb-5 p-4 bg-white/10 rounded-lg w-fit border border-white/20 group-hover:border-white/40 group-hover:bg-white/15 transition-colors duration-200"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-white drop-shadow-sm">
                    {getServiceIcon(service.title)}
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-200 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-teal-100 mb-6 flex-grow leading-relaxed text-sm">
                  {service.description}
                </p>
                <motion.div whileHover={{ x: 5 }}>
                  <Link
                    href="/services"
                    className="text-teal-200 font-semibold hover:text-white inline-flex items-center gap-2 transition-colors duration-200 group"
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
                  </Link>
                </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
