'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/lib/cms/hooks';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WhatsAppButton() {
  const { language } = useLanguage();
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const whatsappNumber1 = settings.whatsapp_number_1 || '+43 660 8439375';
  const whatsappNumber2 = settings.whatsapp_number_2 || '+43 660 2313221';

  const message =
    language === 'ar'
      ? settings.whatsapp_message_ar || 'مرحباً! أود الاستفسار عن خدماتكم.'
      : language === 'fr'
      ? settings.whatsapp_message_fr || 'Bonjour! Je voudrais me renseigner sur vos services.'
      : language === 'de'
      ? settings.whatsapp_message_de || 'Hallo! Ich würde gerne mehr über Ihre Dienstleistungen erfahren.'
      : settings.whatsapp_message_en || 'Hello! I would like to inquire about your services.';

  const encodedMessage = encodeURIComponent(message);

  const formatNumber = (num: string) => {
    return num.replace(/\s+/g, '').replace(/\+/g, '');
  };

  const openWhatsApp = (number: string) => {
    const formattedNumber = formatNumber(number);
    const url = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const buttonText = {
    en: 'WhatsApp',
    fr: 'WhatsApp',
    ar: 'واتساب',
    de: 'WhatsApp',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          {buttonText[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openWhatsApp(whatsappNumber1)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {whatsappNumber1}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openWhatsApp(whatsappNumber2)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {whatsappNumber2}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
