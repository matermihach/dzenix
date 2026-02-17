'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hero } from '@/components/frontend/Hero';
import { ServicesSection } from '@/components/frontend/ServicesSection';
import { useSections, useServices } from '@/lib/cms/hooks';
import { Button } from '@/components/ui/button';
import { getLocalizedValue } from '@/lib/cms/utils';
import { PatternOverlay } from '@/components/frontend/PatternOverlay';

export default function HomePage() {
  const { language } = useLanguage();
  const { sections, loading: sectionsLoading } = useSections('home');
  const { services, loading: servicesLoading } = useServices();

  const heroSection = sections.find(s => s.section_type === 'hero');
  const servicesOverviewSection = sections.find(s => s.section_type === 'services_overview');
  const whyChooseSection = sections.find(s => s.section_type === 'why_choose');
  const processSection = sections.find(s => s.section_type === 'process');
  const whoWeWorkWithSection = sections.find(s => s.section_type === 'who_we_work_with');
  const finalCTASection = sections.find(s => s.section_type === 'final_cta');

  const firstThreeServices = services.slice(0, 3);

  if (sectionsLoading || servicesLoading) {
    return (
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-blue-100 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-blue-100 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {heroSection && <Hero section={heroSection} language={language} />}

      {servicesOverviewSection && firstThreeServices.length > 0 && (
        <>
          <ServicesSection
            services={firstThreeServices}
            language={language}
            title={getLocalizedValue(servicesOverviewSection, 'title', language)}
            showCTA={true}
          />
          <div className="py-8 bg-gradient-to-b from-blue-50 to-white">
            <div className="text-center">
              <Link href={`/${language}/services`}>
                <Button size="lg" variant="outline" className="text-lg border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  {language === 'ar' ? 'شاهد جميع خدماتنا' : language === 'fr' ? 'Voir tous nos services' : 'See all our services'}
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}

      {whyChooseSection && (
        <section className="relative py-20 bg-white overflow-hidden">
          <PatternOverlay sectionId="why-choose" theme="light" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {getLocalizedValue(whyChooseSection, 'title', language)}
              </h2>
              <div className="space-y-8">
                {getLocalizedValue(whyChooseSection, 'content', language)
                  ?.split('\n\n')
                  .map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-lg text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {processSection && (
        <section id="process" className="relative py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
          <PatternOverlay sectionId="process" theme="light" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {getLocalizedValue(processSection, 'title', language)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {getLocalizedValue(processSection, 'content', language)
                  ?.split('\n\n')
                  .filter(step => step.trim())
                  .map((step, idx) => {
                    const [title, ...contentLines] = step.split('\n');
                    return (
                      <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{title}</div>
                        <p className="text-gray-700 leading-relaxed">{contentLines.join(' ')}</p>
                      </div>
                    );
                  })}
              </div>
              <div className="text-center mt-12">
                <Link href={`/${language}/contact`}>
                  <Button size="lg" className="text-lg">
                    {language === 'ar' ? 'ابدأ مشروعًا معنا' : language === 'fr' ? 'Démarrer un projet avec nous' : 'Start a project with us'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {whoWeWorkWithSection && (
        <section className="relative py-20 bg-white overflow-hidden">
          <PatternOverlay sectionId="who-we-work-with" theme="light" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {getLocalizedValue(whoWeWorkWithSection, 'title', language)}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {getLocalizedValue(whoWeWorkWithSection, 'content', language)}
              </p>
            </div>
          </div>
        </section>
      )}

      {finalCTASection && (
        <section id="contact" className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
          <PatternOverlay sectionId="cta" theme="dark" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {getLocalizedValue(finalCTASection, 'title', language)}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {getLocalizedValue(finalCTASection, 'content', language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${language}/contact`}>
                <Button size="lg" variant="secondary" className="text-lg">
                  {getLocalizedValue(finalCTASection, 'cta_text', language)}
                </Button>
              </Link>
              <a href="mailto:contact@dzenix.com">
                <Button size="lg" variant="outline" className="text-lg bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                  {language === 'ar' ? 'راسلنا عبر البريد الإلكتروني' : language === 'fr' ? 'Envoyez-nous un email' : 'Email us'}
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
