'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from '@/lib/cms/types';
import { Language, getLocalizedValue } from '@/lib/cms/utils';
import { PatternOverlay } from './PatternOverlay';

interface HeroProps {
  section: Section;
  language: Language;
}

export function Hero({ section, language }: HeroProps) {
  const title = "We build the digital products you imagine.";
  const subtitle = "Your idea, we build it.";
  const content = getLocalizedValue(section, 'content', language);
  const ctaText = getLocalizedValue(section, 'cta_text', language);
  const ctaLink = section.cta_link;

  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      <PatternOverlay sectionId="hero" theme="light" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight px-2">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 sm:mb-6 leading-relaxed font-medium px-4">
            {subtitle}
          </p>
          {content && (
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
              {content}
            </p>
          )}
          {ctaText && ctaLink && (
            <Link href={ctaLink}>
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                {ctaText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
