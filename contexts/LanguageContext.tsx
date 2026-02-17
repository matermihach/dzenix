'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Language, getLanguagePreference, saveLanguagePreference } from '@/lib/cms/utils';

const LOCALES: Language[] = ['en', 'fr', 'ar', 'de'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: { home: 'Home', services: 'Services', contact: 'Contact', admin: 'Admin', loading: 'Loading...' },
  fr: { home: 'Accueil', services: 'Services', contact: 'Contact', admin: 'Admin', loading: 'Chargement...' },
  ar: { home: 'الرئيسية', services: 'الخدمات', contact: 'اتصل بنا', admin: 'لوحة التحكم', loading: 'جاري التحميل...' },
  de: { home: 'Startseite', services: 'Dienstleistungen', contact: 'Kontakt', admin: 'Admin', loading: 'Wird geladen...' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // ✅ 1) أول مرة: إذا الرابط فيه لغة استعملها، وإلا استعمل preference
  useEffect(() => {
    const urlLang = pathname.split('/')[1] as Language;
    if (LOCALES.includes(urlLang)) {
      setLanguageState(urlLang);
      saveLanguagePreference(urlLang);
    } else {
      const saved = getLanguagePreference();
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  // ✅ 2) أي تغيير في الرابط -> حدّث اللغة
  useEffect(() => {
    const urlLang = pathname.split('/')[1] as Language;
    if (LOCALES.includes(urlLang) && urlLang !== language) {
      setLanguageState(urlLang);
      saveLanguagePreference(urlLang);
    }
  }, [pathname]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguagePreference(lang);
  };

  const t = (key: string) =>
    translations[language][key as keyof typeof translations.en] || key;

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}