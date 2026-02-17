'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Service } from '@/lib/cms/types';
import { Language, getLocalizedValue } from '@/lib/cms/utils';
import * as Icons from 'lucide-react';
import { Check, ArrowRight } from 'lucide-react';
import { PatternOverlay } from './PatternOverlay';

interface ServicesSectionProps {
  services: Service[];
  language: Language;
  title?: string;
  subtitle?: string;
  showCTA?: boolean;
}

export function ServicesSection({ services, language, title, subtitle, showCTA = true }: ServicesSectionProps) {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-16 h-16 text-blue-600" /> : null;
  };

  const getCTAText = (lang: Language) => {
    if (lang === 'ar') return 'ابدأ هذا المشروع';
    if (lang === 'fr') return 'Lancer ce projet';
    if (lang === 'de') return 'Projekt starten';
    return 'Start this project';
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <PatternOverlay sectionId="services" theme="light" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-12 sm:mb-16">
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent px-2">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const serviceTitle = getLocalizedValue(service, 'title', language);
            const description = getLocalizedValue(service, 'description', language);
            const features =
              language === 'ar'
                ? service.features_ar
                : language === 'fr'
                ? service.features_fr
                : service.features_en;

            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-polygon-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative pb-4 sm:pb-6">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-500 shadow-md group-hover:shadow-xl">
                      {getIcon(service.icon)}
                    </div>
                    {service.is_featured && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-md px-2 sm:px-3 py-1 text-xs sm:text-sm">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {serviceTitle}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative space-y-4 sm:space-y-6 flex-grow flex flex-col">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>

                  {features && features.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 flex-grow">
                      <ul className="space-y-3">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                                <Check className="w-3 h-3 text-blue-600" />
                              </div>
                            </div>
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {showCTA && (
                    <div className="pt-6">
                      <Link href={`/${language}/contact`} className="block">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md group-hover:shadow-lg transition-all duration-300"
                        >
                          {getCTAText(language)}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
