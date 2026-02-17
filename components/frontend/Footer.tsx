'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/lib/cms/hooks';
import { WhatsAppButton } from './WhatsAppButton';
import { PatternOverlay } from './PatternOverlay';

export function Footer() {
  const { language } = useLanguage();
  const { settings } = useSiteSettings();

  const content = {
    en: {
      rights: 'All rights reserved.',
      email: 'Email',
      phone: 'Phone',
      quickLinks: 'Quick Links',
      contactUs: 'Contact',
    },
    fr: {
      rights: 'Tous droits réservés.',
      email: 'Email',
      phone: 'Téléphone',
      quickLinks: 'Liens rapides',
      contactUs: 'Contact',
    },
    ar: {
      rights: 'جميع الحقوق محفوظة.',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      quickLinks: 'روابط سريعة',
      contactUs: 'اتصل بنا',
    },
    de: {
      rights: 'Alle Rechte vorbehalten.',
      email: 'E-Mail',
      phone: 'Telefon',
      quickLinks: 'Schnelllinks',
      contactUs: 'Kontakt',
    },
  };

  const t = content[language];
  const email = settings?.contact_email || 'contact@dzenix.com';
  const phone = settings?.contact_phone || '+213 XXX XX XX XX';
  const description =
    language === 'ar'
      ? settings?.description_ar
      : language === 'fr'
      ? settings?.description_fr
      : language === 'de'
      ? settings?.description_de
      : settings?.description_en;

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 to-blue-950 text-white py-8 sm:py-12 overflow-hidden">
      <PatternOverlay sectionId="footer" theme="dark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">DZenix</h3>
            <p className="text-sm sm:text-base text-blue-200">
              {description ||
                (language === 'en'
                  ? 'Professional digital solutions for your business'
                  : language === 'fr'
                  ? 'Solutions digitales professionnelles pour votre entreprise'
                  : language === 'ar'
                  ? 'حلول رقمية احترافية لعملك'
                  : 'Professionelle digitale Lösungen für Ihr Unternehmen')}
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t.contactUs}</h4>
            <div className="space-y-2 text-sm sm:text-base text-blue-200">
              <p className="break-words">
                <span className="font-medium">{t.email}:</span> {email}
              </p>
              <p>
                <span className="font-medium">{t.phone}:</span> {phone}
              </p>
              <div className="pt-3">
                <WhatsAppButton />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t.quickLinks}</h4>
            <div className="space-y-2 text-sm sm:text-base text-blue-200">
              <a href={`/${language}`} className="block hover:text-white transition-colors">
                {language === 'en' ? 'Home' : language === 'fr' ? 'Accueil' : language === 'ar' ? 'الرئيسية' : 'Startseite'}
              </a>
              <a href={`/${language}/services`} className="block hover:text-white transition-colors">
                {language === 'en' ? 'Services' : language === 'fr' ? 'Services' : language === 'ar' ? 'الخدمات' : 'Dienstleistungen'}
              </a>
              <a href={`/${language}/contact`} className="block hover:text-white transition-colors">
                {language === 'en' ? 'Contact' : language === 'fr' ? 'Contact' : language === 'ar' ? 'اتصل بنا' : 'Kontakt'}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-blue-800 text-center text-sm sm:text-base text-blue-200">
          <p>© {new Date().getFullYear()} DZenix. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
