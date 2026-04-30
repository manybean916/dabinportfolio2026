import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

interface Service {
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

const ServiceCard = ({ service, index, lang }: { service: Service, index: number, lang: 'ko' | 'en' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col gap-8 group"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-[40px] shadow-lg ring-1 ring-black/5 hover:ring-black/10 transition-shadow">
        <ImageWithFallback
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="space-y-4 px-4">
        <p className="text-sm font-bold tracking-widest text-pink-500 uppercase">{service.category}</p>
        <h3 
          className="text-4xl font-bold tracking-tight text-gray-900"
          style={{ fontFamily: 'var(--font-pretendard)' }}
        >
          {service.title}
        </h3>
        <p className="text-gray-500 text-lg leading-relaxed max-w-md">{service.description}</p>
        
      </div>
    </motion.div>
  );
};

export const ServicesSection = ({ services, lang }: { services: Service[], lang: 'ko' | 'en' }) => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-20 text-center"
        style={{ fontFamily: 'var(--font-pretendard)' }}
      >
        {lang === 'ko' ? '전문 분야' : 'Expertise'}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} lang={lang} />
        ))}
      </div>
    </section>
  );
};
