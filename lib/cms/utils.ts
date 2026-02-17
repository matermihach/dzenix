export type Language = 'en' | 'fr' | 'ar' | 'de';

export function getLocalizedValue<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  language: Language
): string {
  if (!item) return '';
  const key = `${field}_${language}`;
  return item[key as keyof T] as string || '';
}

export function getSetting(
  settings: Record<string, any> | null,
  key: string,
  language: Language
): string {
  if (!settings || !settings[key]) return '';
  return settings[key] || '';
}

export function saveLanguagePreference(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dzenix_language', lang);
  }
}

export function getLanguagePreference(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('dzenix_language');
    if (saved === 'en' || saved === 'fr' || saved === 'ar' || saved === 'de') {
      return saved;
    }
  }
  return 'en';
}

export function isRTL(language: Language): boolean {
  return language === 'ar';
}
