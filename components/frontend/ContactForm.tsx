'use client';

import { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Language } from '@/lib/cms/utils';
import { countries, getCurrencyForCountry, getBudgetOptions, Currency } from '@/lib/firebase/currency';

interface ContactFormProps {
  language: Language;
}

export function ContactForm({ language }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [budgetOptions, setBudgetOptions] = useState<string[]>(getBudgetOptions('USD'));

  const content = {
    en: {
      title: 'Get in Touch',
      subtitle: 'Tell us about your project',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      country: 'Country',
      projectType: 'Project Type',
      budget: 'Budget Range',
      message: 'Project Description',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully! We will contact you soon.',
      error: 'Failed to send message. Please try again.',
      selectCountry: 'Select your country',
      selectProject: 'Select project type',
      selectBudget: 'Select budget range',
      selectCountryFirst: 'Please select a country first',
      messagePlaceholder: 'Tell us about your project...',
      projectTypes: {
        'mobile-app': 'Mobile Application',
        'website': 'Website Development',
        'ai-solution': 'AI Solution',
        'ecommerce': 'E-commerce Platform',
        'other': 'Other',
      },
    },
    fr: {
      title: 'Contactez-nous',
      subtitle: 'Parlez-nous de votre projet',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      country: 'Pays',
      projectType: 'Type de Projet',
      budget: 'Gamme de Budget',
      message: 'Description du Projet',
      submit: 'Envoyer le Message',
      submitting: 'Envoi...',
      success: 'Message envoyé avec succès ! Nous vous contacterons bientôt.',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.',
      selectCountry: 'Sélectionnez votre pays',
      selectProject: 'Sélectionnez le type de projet',
      selectBudget: 'Sélectionnez la gamme de budget',
      selectCountryFirst: 'Veuillez d\'abord sélectionner un pays',
      messagePlaceholder: 'Parlez-nous de votre projet...',
      projectTypes: {
        'mobile-app': 'Application Mobile',
        'website': 'Développement de Site Web',
        'ai-solution': 'Solution IA',
        'ecommerce': 'Plateforme E-commerce',
        'other': 'Autre',
      },
    },
    ar: {
      title: 'تواصل معنا',
      subtitle: 'أخبرنا عن مشروعك',
      fullName: 'الاسم الكامل',
      email: 'عنوان البريد الإلكتروني',
      phone: 'رقم الهاتف',
      country: 'الدولة',
      projectType: 'نوع المشروع',
      budget: 'نطاق الميزانية',
      message: 'وصف المشروع',
      submit: 'إرسال الرسالة',
      submitting: 'جاري الإرسال...',
      success: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
      error: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      selectCountry: 'اختر دولتك',
      selectProject: 'اختر نوع المشروع',
      selectBudget: 'اختر نطاق الميزانية',
      selectCountryFirst: 'يرجى اختيار الدولة أولاً',
      messagePlaceholder: 'أخبرنا عن مشروعك...',
      projectTypes: {
        'mobile-app': 'تطبيق جوال',
        'website': 'تطوير موقع ويب',
        'ai-solution': 'حل ذكاء اصطناعي',
        'ecommerce': 'منصة تجارة إلكترونية',
        'other': 'أخرى',
      },
    },
    de: {
      title: 'Kontakt aufnehmen',
      subtitle: 'Erzählen Sie uns von Ihrem Projekt',
      fullName: 'Vollständiger Name',
      email: 'E-Mail-Adresse',
      phone: 'Telefonnummer',
      country: 'Land',
      projectType: 'Projekttyp',
      budget: 'Budget-Bereich',
      message: 'Projektbeschreibung',
      submit: 'Nachricht senden',
      submitting: 'Wird gesendet...',
      success: 'Nachricht erfolgreich gesendet! Wir werden uns bald bei Ihnen melden.',
      error: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.',
      selectCountry: 'Wählen Sie Ihr Land',
      selectProject: 'Wählen Sie den Projekttyp',
      selectBudget: 'Wählen Sie den Budget-Bereich',
      selectCountryFirst: 'Bitte wählen Sie zuerst ein Land',
      messagePlaceholder: 'Erzählen Sie uns von Ihrem Projekt...',
      projectTypes: {
        'mobile-app': 'Mobile Anwendung',
        'website': 'Website-Entwicklung',
        'ai-solution': 'KI-Lösung',
        'ecommerce': 'E-Commerce-Plattform',
        'other': 'Andere',
      },
    },
  };

  const t = content[language];

  function handleCountryChange(countryCode: string) {
    setSelectedCountry(countryCode);
    const newCurrency = getCurrencyForCountry(countryCode);
    setCurrency(newCurrency);
    setBudgetOptions(getBudgetOptions(newCurrency));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const lead = {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
        country: selectedCountry,
        currency: currency,
        projectType: formData.get('projectType') as string,
        budget: formData.get('budget') as string,
        message: formData.get('message') as string || '',
        language: language,
        status: 'new',
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'leads'), lead);

      toast.success(t.success);
      e.currentTarget.reset();
      setSelectedCountry('');
      setCurrency('USD');
      setBudgetOptions(getBudgetOptions('USD'));
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl text-center">{t.title}</CardTitle>
            <p className="text-center text-blue-100 mt-2 text-sm sm:text-base">{t.subtitle}</p>
          </CardHeader>
          <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-semibold">
                  {t.fullName} *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    {t.email} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="john@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700 font-semibold">
                  {t.country} *
                </Label>
                <Select
                  name="country"
                  value={selectedCountry}
                  onValueChange={handleCountryChange}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={t.selectCountry} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCountry && (
                  <p className="text-sm text-blue-600 mt-1">
                    Currency: <span className="font-semibold">{currency}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-gray-700 font-semibold">
                  {t.projectType} *
                </Label>
                <Select name="projectType" required>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={t.selectProject} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.projectTypes).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-gray-700 font-semibold">
                  {t.budget} *
                </Label>
                <Select name="budget" required disabled={!selectedCountry}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={t.selectBudget} />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedCountry && (
                  <p className="text-sm text-gray-500">
                    {t.selectCountryFirst}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-semibold">
                  {t.message}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={t.messagePlaceholder}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
                disabled={loading}
              >
                {loading ? t.submitting : t.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
