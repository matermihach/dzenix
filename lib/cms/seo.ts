import { Metadata } from 'next';
import { Page, SiteSettings } from './types';

export function generateMetadata(
  page: Page | null,
  settings: SiteSettings | null,
  language: string = 'en'
): Metadata {
  const langKey = language as 'en' | 'fr' | 'ar' | 'de';

  const title = page?.[`meta_title_${langKey}` as keyof Page] as string ||
                page?.[`title_${langKey}` as keyof Page] as string ||
                settings?.default_meta_title ||
                'DZenix - Transform Your Digital Vision';

  const description = page?.[`meta_description_${langKey}` as keyof Page] as string ||
                     settings?.default_meta_description ||
                     'Professional digital solutions for your business';

  const keywords = page?.[`meta_keywords_${langKey}` as keyof Page] as string ||
                  settings?.default_meta_keywords ||
                  'web development, app development, digital solutions';

  const ogTitle = page?.[`og_title_${langKey}` as keyof Page] as string || title;

  const ogDescription = page?.[`og_description_${langKey}` as keyof Page] as string || description;

  const ogImage = page?.og_image || settings?.default_og_image || '/dzenix.png';

  const baseUrl = settings?.site_base_url || 'https://dzenix.com';
  const canonicalUrl = page?.canonical_url || `${baseUrl}/${language}${page?.slug ? `/${page.slug}` : ''}`;

  const robotsIndex = page?.robots_index ?? true;

  return {
    title,
    description,
    keywords: keywords?.split(',').map(k => k.trim()),
    authors: [{ name: 'DZenix' }],
    creator: 'DZenix',
    publisher: 'DZenix',
    robots: {
      index: robotsIndex,
      follow: robotsIndex,
      googleBot: {
        index: robotsIndex,
        follow: robotsIndex,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'ar': `${baseUrl}/ar`,
        'de': `${baseUrl}/de`,
      },
    },
    openGraph: {
      type: 'website',
      locale: language === 'ar' ? 'ar_DZ' : language === 'fr' ? 'fr_FR' : language === 'de' ? 'de_DE' : 'en_US',
      url: canonicalUrl,
      title: ogTitle,
      description: ogDescription,
      siteName: settings?.site_name || 'DZenix',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
  };
}
