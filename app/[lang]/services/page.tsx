'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { ServicesSection } from '@/components/frontend/ServicesSection';
import { useServices } from '@/lib/cms/hooks';
import { PatternOverlay } from '@/components/frontend/PatternOverlay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const { language } = useLanguage();
  const { services, loading } = useServices();

  if (loading) {
    return (
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-blue-100 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-blue-100 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-blue-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <PatternOverlay sectionId="services" theme="dark" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {language === 'ar' ? 'خدماتنا' : language === 'fr' ? 'Nos Services' : 'Our Services'}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {language === 'ar'
                ? 'حلول رقمية شاملة مصممة خصيصاً لتلبية احتياجات عملك'
                : language === 'fr'
                ? 'Solutions digitales complètes adaptées aux besoins de votre entreprise'
                : 'Comprehensive digital solutions tailored to your business needs'}
            </p>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <ServicesSection
          services={services}
          language={language}
        />
      )}

      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <PatternOverlay sectionId="cta" theme="light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {language === 'ar' ? 'هل أنت مستعد لبدء مشروعك؟' : language === 'fr' ? 'Prêt à Démarrer Votre Projet ?' : 'Ready to Start Your Project?'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {language === 'ar'
              ? 'تواصل معنا اليوم للحصول على استشارة مجانية ودعنا نساعدك على تحقيق رؤيتك.'
              : language === 'fr'
              ? 'Contactez-nous aujourd\'hui pour une consultation gratuite et laissez-nous vous aider à donner vie à votre vision.'
              : 'Contact us today for a free consultation and let us help bring your vision to life.'}
          </p>
          <a
            href={`/${language}/contact`}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            {language === 'ar' ? 'تواصل معنا' : language === 'fr' ? 'Contactez-Nous' : 'Get in Touch'}
          </a>
        </div>
      </section>
    </main>
  );
}
