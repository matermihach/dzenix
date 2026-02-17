'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from './WhatsAppButton';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useSiteSettings } from '@/lib/cms/hooks';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();

  // 🔥 Change language by modifying URL
  const changeLanguage = (newLang: string) => {
    const segments = pathname.split('/');

    if (segments.length > 1) {
      segments[1] = newLang;
    } else {
      segments.push(newLang);
    }

    const newPath = segments.join('/');
    router.push(newPath);
  };

  const nav = {
    en: {
      home: 'Home',
      services: 'Services',
      contact: 'Contact',
    },
    fr: {
      home: 'Accueil',
      services: 'Services',
      contact: 'Contact',
    },
    ar: {
      home: 'الرئيسية',
      services: 'الخدمات',
      contact: 'اتصل بنا',
    },
    de: {
      home: 'Startseite',
      services: 'Dienstleistungen',
      contact: 'Kontakt',
    },
  };

  const t = nav[language];

  const logoUrl = settings?.logo_url || '/dzenix.png';
  const logoWidth = settings?.logo_width || 40;
  const logoHeight = settings?.logo_height || 40;
  const logoAlt =
    (settings?.[`logo_alt_${language}` as keyof typeof settings] as string) ||
    settings?.site_name ||
    'DZenix';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Logo */}
          <Link href={`/${language}`} className="flex items-center gap-2 min-w-0">
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="object-contain flex-shrink-0"
            />
            <span className="text-lg sm:text-2xl font-bold truncate">
              {settings?.site_name || 'DZenix'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href={`/${language}`} className="hover:text-gray-600 transition-colors">
              {t.home}
            </Link>
            <Link href={`/${language}/services`} className="hover:text-gray-600 transition-colors">
              {t.services}
            </Link>
            <Link href={`/${language}/contact`} className="hover:text-gray-600 transition-colors">
              {t.contact}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">

            {/* WhatsApp */}
            <div className="hidden lg:block">
              <WhatsAppButton />
            </div>

            {/* Language Switch */}
            <div className="flex gap-1">
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeLanguage('en')}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                EN
              </Button>

              <Button
                variant={language === 'fr' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeLanguage('fr')}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                FR
              </Button>

              <Button
                variant={language === 'ar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeLanguage('ar')}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                AR
              </Button>

              <Button
                variant={language === 'de' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeLanguage('de')}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                DE
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-gray-100">
            <Link
              href={`/${language}`}
              className="block hover:text-gray-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.home}
            </Link>
            <Link
              href={`/${language}/services`}
              className="block hover:text-gray-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.services}
            </Link>
            <Link
              href={`/${language}/contact`}
              className="block hover:text-gray-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.contact}
            </Link>

            <div className="pt-2">
              <WhatsAppButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}