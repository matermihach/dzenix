'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { ContactForm } from '@/components/frontend/ContactForm';
import { useSections } from '@/lib/cms/hooks';
import { PatternOverlay } from '@/components/frontend/PatternOverlay';

export default function ContactPage() {
  const { language } = useLanguage();
  const { sections, loading } = useSections('contact');

  const contactSection = sections.find(s => s.section_type === 'contact_intro');

  const defaultContent = {
    en: {
      title: 'Let\'s Build Something Great Together',
      subtitle: 'Get in Touch',
      description: 'Ready to start your project? Fill out the form below and our team will get back to you within 24 hours. We support multiple currencies and work with clients worldwide.',
    },
    fr: {
      title: 'Construisons Quelque Chose de Grand Ensemble',
      subtitle: 'Contactez-Nous',
      description: 'Prêt à démarrer votre projet ? Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les 24 heures. Nous supportons plusieurs devises et travaillons avec des clients du monde entier.',
    },
    ar: {
      title: 'لنبني شيئاً عظيماً معاً',
      subtitle: 'تواصل معنا',
      description: 'هل أنت مستعد لبدء مشروعك؟ املأ النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة. نحن ندعم عملات متعددة ونعمل مع عملاء من جميع أنحاء العالم.',
    },
    de: {
      title: 'Gemeinsam etwas Großartiges schaffen',
      subtitle: 'Kontakt aufnehmen',
      description: 'Bereit, Ihr Projekt zu starten? Füllen Sie das untenstehende Formular aus und unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden. Wir unterstützen mehrere Währungen und arbeiten mit Kunden weltweit.',
    },
  };

  const title = contactSection?.title_en
    ? (language === 'ar' ? contactSection.title_ar : language === 'fr' ? contactSection.title_fr : language === 'de' ? contactSection.title_de : contactSection.title_en)
    : defaultContent[language].title;

  const subtitle = contactSection?.subtitle_en
    ? (language === 'ar' ? contactSection.subtitle_ar : language === 'fr' ? contactSection.subtitle_fr : language === 'de' ? contactSection.subtitle_de : contactSection.subtitle_en)
    : defaultContent[language].subtitle;

  const description = contactSection?.content_en
    ? (language === 'ar' ? contactSection.content_ar : language === 'fr' ? contactSection.content_fr : language === 'de' ? contactSection.content_de : contactSection.content_en)
    : defaultContent[language].description;

  return (
    <main>
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <PatternOverlay sectionId="contact" theme="dark" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-2xl mb-4 opacity-90">{subtitle}</p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">{description}</p>
          </div>
        </div>
      </section>

      <ContactForm language={language} />
    </main>
  );
}
