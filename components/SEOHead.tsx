'use client';

import Head from 'next/head';
import { useSiteSettings } from '@/lib/cms/hooks';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  language?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  robotsIndex = true,
  language = 'en'
}: SEOHeadProps) {
  const { settings } = useSiteSettings();

  const finalTitle = title || settings?.default_meta_title || 'DZenix - Transform Your Digital Vision';
  const finalDescription = description || settings?.default_meta_description || 'Professional digital solutions for your business';
  const finalKeywords = keywords || settings?.default_meta_keywords || 'web development, app development, digital solutions';
  const finalOGImage = ogImage || settings?.default_og_image || '/dzenix.png';
  const finalOGTitle = ogTitle || finalTitle;
  const finalOGDescription = ogDescription || finalDescription;
  const baseUrl = settings?.site_base_url || 'https://dzenix.com';
  const finalCanonicalUrl = canonicalUrl || baseUrl;

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="robots" content={robotsIndex ? 'index, follow' : 'noindex, nofollow'} />
      <link rel="canonical" href={finalCanonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOGTitle} />
      <meta property="og:description" content={finalOGDescription} />
      <meta property="og:image" content={finalOGImage} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_DZ' : language === 'fr' ? 'fr_FR' : language === 'de' ? 'de_DE' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOGTitle} />
      <meta name="twitter:description" content={finalOGDescription} />
      <meta name="twitter:image" content={finalOGImage} />

      <meta httpEquiv="Content-Language" content={language} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />
    </Head>
  );
}
