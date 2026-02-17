'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/lib/cms/types';
import { Language, getLocalizedValue } from '@/lib/cms/utils';

interface FAQSectionProps {
  faqs: FAQ[];
  language: Language;
  title?: string;
}

export function FAQSection({ faqs, language, title }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {title}
          </h2>
        )}

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => {
            const question = getLocalizedValue(faq, 'question', language);
            const answer = getLocalizedValue(faq, 'answer', language);

            return (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="bg-white px-6 rounded-lg border-blue-100 hover:border-blue-300 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
