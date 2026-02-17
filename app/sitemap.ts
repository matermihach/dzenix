import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dzenix.com';
  const languages = ['en', 'fr', 'ar', 'de'];
  const pages = ['', 'services', 'contact'];

  const sitemap: MetadataRoute.Sitemap = [];

  languages.forEach(lang => {
    pages.forEach(page => {
      const url = page ? `${baseUrl}/${lang}/${page}` : `${baseUrl}/${lang}`;
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });
  });

  return sitemap;
}
