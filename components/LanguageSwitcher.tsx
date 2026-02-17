'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const LOCALES = ['en', 'fr', 'ar', 'de'] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const currentLang = LOCALES.includes(segments[0] as any)
    ? segments[0]
    : 'en';

  const restPath = segments.slice(1).join('/');

  return (
    <div className="flex gap-2">
      {LOCALES.map((lang) => {
        const href = `/${lang}${restPath ? `/${restPath}` : ''}`;

        return (
          <Button
            key={lang}
            variant={currentLang === lang ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href={href} scroll={false}>
              {lang.toUpperCase()}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}