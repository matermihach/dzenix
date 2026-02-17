'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, Globe, FileText } from 'lucide-react';
import { getCollection, updateDocument } from '@/lib/firebase/firestore';
import { uploadImage } from '@/lib/firebase/storage';
import { toast } from 'sonner';
import { SiteSettings, Page } from '@/lib/cms/types';

export default function SEOPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);

  const [globalSEO, setGlobalSEO] = useState({
    default_meta_title: '',
    default_meta_description: '',
    default_meta_keywords: '',
    default_og_image: '',
    site_base_url: '',
  });

  const [pagesSEO, setPagesSEO] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const settingsData = await getCollection('site_settings');
    if (settingsData.length > 0) {
      const settings = settingsData[0] as SiteSettings;
      setSettingsId(settings.id);
      setGlobalSEO({
        default_meta_title: settings.default_meta_title || '',
        default_meta_description: settings.default_meta_description || '',
        default_meta_keywords: settings.default_meta_keywords || '',
        default_og_image: settings.default_og_image || '',
        site_base_url: settings.site_base_url || '',
      });
    }

    const pagesData = await getCollection('pages');
    const typedPages = pagesData as Page[];
    setPages(typedPages);

    const pagesMap: Record<string, any> = {};
    typedPages.forEach(page => {
      pagesMap[page.id] = {
        meta_title_en: page.meta_title_en || '',
        meta_title_fr: page.meta_title_fr || '',
        meta_title_ar: page.meta_title_ar || '',
        meta_title_de: page.meta_title_de || '',
        meta_description_en: page.meta_description_en || '',
        meta_description_fr: page.meta_description_fr || '',
        meta_description_ar: page.meta_description_ar || '',
        meta_description_de: page.meta_description_de || '',
        meta_keywords_en: page.meta_keywords_en || '',
        meta_keywords_fr: page.meta_keywords_fr || '',
        meta_keywords_ar: page.meta_keywords_ar || '',
        meta_keywords_de: page.meta_keywords_de || '',
        og_title_en: page.og_title_en || '',
        og_title_fr: page.og_title_fr || '',
        og_title_ar: page.og_title_ar || '',
        og_title_de: page.og_title_de || '',
        og_description_en: page.og_description_en || '',
        og_description_fr: page.og_description_fr || '',
        og_description_ar: page.og_description_ar || '',
        og_description_de: page.og_description_de || '',
        og_image: page.og_image || '',
        canonical_url: page.canonical_url || '',
        robots_index: page.robots_index ?? true,
      };
    });
    setPagesSEO(pagesMap);

    setLoading(false);
  }

  async function handleOGImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    const { url, error } = await uploadImage(file, 'og-images');

    if (error) {
      toast.error('Failed to upload image: ' + error);
      setUploading(false);
      return;
    }

    setGlobalSEO({ ...globalSEO, default_og_image: url });
    toast.success('OG Image uploaded successfully');
    setUploading(false);
  }

  async function handlePageOGImageUpload(pageId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    const { url, error } = await uploadImage(file, 'og-images');

    if (error) {
      toast.error('Failed to upload image: ' + error);
      setUploading(false);
      return;
    }

    setPagesSEO({
      ...pagesSEO,
      [pageId]: { ...pagesSEO[pageId], og_image: url }
    });
    toast.success('OG Image uploaded successfully');
    setUploading(false);
  }

  async function handleSaveGlobal() {
    if (!settingsId) {
      toast.error('Settings not found');
      return;
    }

    setSaving(true);
    const { error } = await updateDocument('site_settings', settingsId, globalSEO);

    if (error) {
      toast.error('Failed to update global SEO: ' + error);
    } else {
      toast.success('Global SEO updated successfully');
    }
    setSaving(false);
  }

  async function handleSavePage(pageId: string) {
    setSaving(true);
    const { error } = await updateDocument('pages', pageId, pagesSEO[pageId]);

    if (error) {
      toast.error('Failed to update page SEO: ' + error);
    } else {
      toast.success('Page SEO updated successfully');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">SEO Settings</h1>
        <p className="text-gray-600">Loading SEO settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          SEO Settings
        </h1>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">
            <Globe className="w-4 h-4 mr-2" />
            Global SEO
          </TabsTrigger>
          <TabsTrigger value="pages">
            <FileText className="w-4 h-4 mr-2" />
            Per-Page SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_base_url">Site Base URL</Label>
                <Input
                  id="site_base_url"
                  value={globalSEO.site_base_url}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, site_base_url: e.target.value })}
                  placeholder="https://dzenix.com"
                />
                <p className="text-sm text-gray-500 mt-1">Your website&apos;s base URL (used for canonical URLs and sitemap)</p>
              </div>

              <div>
                <Label htmlFor="default_meta_title">Default Meta Title</Label>
                <Input
                  id="default_meta_title"
                  value={globalSEO.default_meta_title}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, default_meta_title: e.target.value })}
                  placeholder="DZenix - Transform Your Digital Vision"
                />
                <p className="text-sm text-gray-500 mt-1">Fallback title when page-specific title is not set</p>
              </div>

              <div>
                <Label htmlFor="default_meta_description">Default Meta Description</Label>
                <Textarea
                  id="default_meta_description"
                  value={globalSEO.default_meta_description}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, default_meta_description: e.target.value })}
                  placeholder="Professional digital solutions for your business"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Fallback description when page-specific description is not set</p>
              </div>

              <div>
                <Label htmlFor="default_meta_keywords">Default Meta Keywords</Label>
                <Input
                  id="default_meta_keywords"
                  value={globalSEO.default_meta_keywords}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, default_meta_keywords: e.target.value })}
                  placeholder="web development, app development, digital solutions"
                />
                <p className="text-sm text-gray-500 mt-1">Comma-separated keywords</p>
              </div>

              <div>
                <Label>Default Open Graph Image</Label>
                {globalSEO.default_og_image && (
                  <div className="mt-2 mb-3">
                    <img
                      src={globalSEO.default_og_image}
                      alt="OG Image preview"
                      className="max-w-xs border rounded"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleOGImageUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630px</p>
              </div>

              <Button
                onClick={handleSaveGlobal}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Global SEO'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>SEO for {page.title_en}</span>
                  <span className="text-sm font-normal text-gray-500">/{page.slug}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="en" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="fr">French</TabsTrigger>
                    <TabsTrigger value="ar">Arabic</TabsTrigger>
                    <TabsTrigger value="de">German</TabsTrigger>
                  </TabsList>

                  {['en', 'fr', 'ar', 'de'].map((lang) => (
                    <TabsContent key={lang} value={lang} className="space-y-4">
                      <div>
                        <Label htmlFor={`meta_title_${lang}_${page.id}`}>Meta Title ({lang.toUpperCase()})</Label>
                        <Input
                          id={`meta_title_${lang}_${page.id}`}
                          value={pagesSEO[page.id]?.[`meta_title_${lang}`] || ''}
                          onChange={(e) => setPagesSEO({
                            ...pagesSEO,
                            [page.id]: { ...pagesSEO[page.id], [`meta_title_${lang}`]: e.target.value }
                          })}
                          placeholder="Page title for SEO"
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`meta_description_${lang}_${page.id}`}>Meta Description ({lang.toUpperCase()})</Label>
                        <Textarea
                          id={`meta_description_${lang}_${page.id}`}
                          value={pagesSEO[page.id]?.[`meta_description_${lang}`] || ''}
                          onChange={(e) => setPagesSEO({
                            ...pagesSEO,
                            [page.id]: { ...pagesSEO[page.id], [`meta_description_${lang}`]: e.target.value }
                          })}
                          placeholder="Page description for SEO"
                          rows={3}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`meta_keywords_${lang}_${page.id}`}>Meta Keywords ({lang.toUpperCase()})</Label>
                        <Input
                          id={`meta_keywords_${lang}_${page.id}`}
                          value={pagesSEO[page.id]?.[`meta_keywords_${lang}`] || ''}
                          onChange={(e) => setPagesSEO({
                            ...pagesSEO,
                            [page.id]: { ...pagesSEO[page.id], [`meta_keywords_${lang}`]: e.target.value }
                          })}
                          placeholder="keyword1, keyword2, keyword3"
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`og_title_${lang}_${page.id}`}>Open Graph Title ({lang.toUpperCase()})</Label>
                        <Input
                          id={`og_title_${lang}_${page.id}`}
                          value={pagesSEO[page.id]?.[`og_title_${lang}`] || ''}
                          onChange={(e) => setPagesSEO({
                            ...pagesSEO,
                            [page.id]: { ...pagesSEO[page.id], [`og_title_${lang}`]: e.target.value }
                          })}
                          placeholder="Title for social media sharing"
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`og_description_${lang}_${page.id}`}>Open Graph Description ({lang.toUpperCase()})</Label>
                        <Textarea
                          id={`og_description_${lang}_${page.id}`}
                          value={pagesSEO[page.id]?.[`og_description_${lang}`] || ''}
                          onChange={(e) => setPagesSEO({
                            ...pagesSEO,
                            [page.id]: { ...pagesSEO[page.id], [`og_description_${lang}`]: e.target.value }
                          })}
                          placeholder="Description for social media sharing"
                          rows={3}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Technical SEO</h4>

                  <div className="space-y-4">
                    <div>
                      <Label>Open Graph Image</Label>
                      {pagesSEO[page.id]?.og_image && (
                        <div className="mt-2 mb-3">
                          <img
                            src={pagesSEO[page.id].og_image}
                            alt="OG Image preview"
                            className="max-w-xs border rounded"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePageOGImageUpload(page.id, e)}
                        disabled={uploading}
                        className="cursor-pointer"
                      />
                      {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                      <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630px</p>
                    </div>

                    <div>
                      <Label htmlFor={`canonical_url_${page.id}`}>Canonical URL</Label>
                      <Input
                        id={`canonical_url_${page.id}`}
                        value={pagesSEO[page.id]?.canonical_url || ''}
                        onChange={(e) => setPagesSEO({
                          ...pagesSEO,
                          [page.id]: { ...pagesSEO[page.id], canonical_url: e.target.value }
                        })}
                        placeholder="https://dzenix.com/page"
                      />
                      <p className="text-sm text-gray-500 mt-1">Leave empty to use default</p>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        id={`robots_index_${page.id}`}
                        type="checkbox"
                        checked={pagesSEO[page.id]?.robots_index ?? true}
                        onChange={(e) => setPagesSEO({
                          ...pagesSEO,
                          [page.id]: { ...pagesSEO[page.id], robots_index: e.target.checked }
                        })}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <Label htmlFor={`robots_index_${page.id}`} className="cursor-pointer">
                        Allow search engines to index this page
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSavePage(page.id)}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : `Save ${page.title_en} SEO`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
