'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload, X } from 'lucide-react';
import { getCollection, updateDocument, addDocument } from '@/lib/firebase/firestore';
import { uploadImage } from '@/lib/firebase/storage';
import { toast } from 'sonner';
import { SiteSettings } from '@/lib/cms/types';
import Image from 'next/image';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    site_name: '',
    tagline_en: '',
    tagline_fr: '',
    tagline_ar: '',
    tagline_de: '',
    description_en: '',
    description_fr: '',
    description_ar: '',
    description_de: '',
    contact_email: '',
    contact_phone: '',
    address_en: '',
    address_fr: '',
    address_ar: '',
    address_de: '',
    whatsapp_number_1: '+43 660 8439375',
    whatsapp_number_2: '+43 660 2313221',
    whatsapp_message_en: 'Hello! I would like to inquire about your services.',
    whatsapp_message_fr: 'Bonjour! Je voudrais me renseigner sur vos services.',
    whatsapp_message_ar: 'مرحباً! أود الاستفسار عن خدماتكم.',
    whatsapp_message_de: 'Hallo! Ich würde gerne mehr über Ihre Dienstleistungen erfahren.',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    social_instagram: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff',
    logo_url: '/dzenix.png',
    logo_width: 40,
    logo_height: 40,
    logo_alt_en: 'DZenix Logo',
    logo_alt_fr: 'Logo DZenix',
    logo_alt_ar: 'شعار DZenix',
    logo_alt_de: 'DZenix Logo',
    pattern_enabled: true,
    pattern_opacity_light: 8,
    pattern_opacity_dark: 12,
    pattern_scale: 370,
    pattern_stroke_width: 1,
    pattern_color_light: '#2563eb',
    pattern_color_dark: '#ffffff',
    pattern_enabled_sections: ['hero', 'services', 'why-choose', 'process', 'who-we-work-with', 'cta', 'footer', 'contact'] as string[],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const data = await getCollection('site_settings');
    if (data.length > 0) {
      const settings = data[0] as SiteSettings;
      setSettingsId(settings.id);
      setFormData({
        site_name: settings.site_name || '',
        tagline_en: settings.tagline_en || '',
        tagline_fr: settings.tagline_fr || '',
        tagline_ar: settings.tagline_ar || '',
        tagline_de: settings.tagline_de || '',
        description_en: settings.description_en || '',
        description_fr: settings.description_fr || '',
        description_ar: settings.description_ar || '',
        description_de: settings.description_de || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address_en: settings.address_en || '',
        address_fr: settings.address_fr || '',
        address_ar: settings.address_ar || '',
        address_de: settings.address_de || '',
        whatsapp_number_1: settings.whatsapp_number_1 || '+43 660 8439375',
        whatsapp_number_2: settings.whatsapp_number_2 || '+43 660 2313221',
        whatsapp_message_en: settings.whatsapp_message_en || 'Hello! I would like to inquire about your services.',
        whatsapp_message_fr: settings.whatsapp_message_fr || 'Bonjour! Je voudrais me renseigner sur vos services.',
        whatsapp_message_ar: settings.whatsapp_message_ar || 'مرحباً! أود الاستفسار عن خدماتكم.',
        whatsapp_message_de: settings.whatsapp_message_de || 'Hallo! Ich würde gerne mehr über Ihre Dienstleistungen erfahren.',
        social_facebook: settings.social_facebook || '',
        social_twitter: settings.social_twitter || '',
        social_linkedin: settings.social_linkedin || '',
        social_instagram: settings.social_instagram || '',
        primary_color: settings.primary_color || '#2563eb',
        secondary_color: settings.secondary_color || '#ffffff',
        logo_url: settings.logo_url || '/dzenix.png',
        logo_width: settings.logo_width || 40,
        logo_height: settings.logo_height || 40,
        logo_alt_en: settings.logo_alt_en || 'DZenix Logo',
        logo_alt_fr: settings.logo_alt_fr || 'Logo DZenix',
        logo_alt_ar: settings.logo_alt_ar || 'شعار DZenix',
        logo_alt_de: settings.logo_alt_de || 'DZenix Logo',
        pattern_enabled: settings.pattern_enabled ?? true,
        pattern_opacity_light: settings.pattern_opacity_light ?? 8,
        pattern_opacity_dark: settings.pattern_opacity_dark ?? 12,
        pattern_scale: settings.pattern_scale ?? 370,
        pattern_stroke_width: settings.pattern_stroke_width ?? 1,
        pattern_color_light: settings.pattern_color_light || '#2563eb',
        pattern_color_dark: settings.pattern_color_dark || '#ffffff',
        pattern_enabled_sections: settings.pattern_enabled_sections || ['hero', 'services', 'why-choose', 'process', 'who-we-work-with', 'cta', 'footer', 'contact'],
      });
    }
    setLoading(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    const { url, error } = await uploadImage(file, 'logos');

    if (error) {
      toast.error('Failed to upload logo: ' + error);
      setUploading(false);
      return;
    }

    setFormData({ ...formData, logo_url: url });
    toast.success('Logo uploaded successfully');
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);

    if (settingsId) {
      const { error } = await updateDocument('site_settings', settingsId, formData);
      if (error) {
        toast.error('Failed to update settings: ' + error);
      } else {
        toast.success('Settings updated successfully');
      }
    } else {
      const { id, error } = await addDocument('site_settings', formData);
      if (error) {
        toast.error('Failed to create settings: ' + error);
      } else {
        setSettingsId(id);
        toast.success('Settings created successfully');
      }
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Site Settings
        </h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="DZenix"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tagline_en">Tagline (English)</Label>
                <Input
                  id="tagline_en"
                  value={formData.tagline_en}
                  onChange={(e) => setFormData({ ...formData, tagline_en: e.target.value })}
                  placeholder="Transform Your Digital Vision"
                />
              </div>
              <div>
                <Label htmlFor="tagline_fr">Tagline (French)</Label>
                <Input
                  id="tagline_fr"
                  value={formData.tagline_fr}
                  onChange={(e) => setFormData({ ...formData, tagline_fr: e.target.value })}
                  placeholder="Transformez Votre Vision Digitale"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tagline_ar">Tagline (Arabic)</Label>
                <Input
                  id="tagline_ar"
                  value={formData.tagline_ar}
                  onChange={(e) => setFormData({ ...formData, tagline_ar: e.target.value })}
                  placeholder="حوّل رؤيتك الرقمية"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="tagline_de">Tagline (German)</Label>
                <Input
                  id="tagline_de"
                  value={formData.tagline_de}
                  onChange={(e) => setFormData({ ...formData, tagline_de: e.target.value })}
                  placeholder="Verwandeln Sie Ihre digitale Vision"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Professional digital solutions..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description_fr">Description (French)</Label>
                <Textarea
                  id="description_fr"
                  value={formData.description_fr}
                  onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                  placeholder="Solutions digitales professionnelles..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="حلول رقمية احترافية..."
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_de">Description (German)</Label>
                <Textarea
                  id="description_de"
                  value={formData.description_de}
                  onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
                  placeholder="Professionelle digitale Lösungen..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Logo</Label>
              {formData.logo_url && (
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative border rounded p-4 bg-gray-50">
                    <Image
                      src={formData.logo_url}
                      alt="Logo preview"
                      width={formData.logo_width || 40}
                      height={formData.logo_height || 40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.logo_width}px × {formData.logo_height}px
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="logo-upload">Upload New Logo</Label>
              <div className="mt-2">
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && (
                  <p className="text-sm text-gray-600 mt-1">Uploading...</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo_width">Logo Width (px)</Label>
                <Input
                  id="logo_width"
                  type="number"
                  value={formData.logo_width}
                  onChange={(e) => setFormData({ ...formData, logo_width: parseInt(e.target.value) || 40 })}
                  placeholder="40"
                  min="10"
                  max="200"
                />
              </div>
              <div>
                <Label htmlFor="logo_height">Logo Height (px)</Label>
                <Input
                  id="logo_height"
                  type="number"
                  value={formData.logo_height}
                  onChange={(e) => setFormData({ ...formData, logo_height: parseInt(e.target.value) || 40 })}
                  placeholder="40"
                  min="10"
                  max="200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo_alt_en">Logo Alt Text (English)</Label>
                <Input
                  id="logo_alt_en"
                  value={formData.logo_alt_en}
                  onChange={(e) => setFormData({ ...formData, logo_alt_en: e.target.value })}
                  placeholder="DZenix Logo"
                />
              </div>
              <div>
                <Label htmlFor="logo_alt_fr">Logo Alt Text (French)</Label>
                <Input
                  id="logo_alt_fr"
                  value={formData.logo_alt_fr}
                  onChange={(e) => setFormData({ ...formData, logo_alt_fr: e.target.value })}
                  placeholder="Logo DZenix"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo_alt_ar">Logo Alt Text (Arabic)</Label>
                <Input
                  id="logo_alt_ar"
                  value={formData.logo_alt_ar}
                  onChange={(e) => setFormData({ ...formData, logo_alt_ar: e.target.value })}
                  placeholder="شعار DZenix"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="logo_alt_de">Logo Alt Text (German)</Label>
                <Input
                  id="logo_alt_de"
                  value={formData.logo_alt_de}
                  onChange={(e) => setFormData({ ...formData, logo_alt_de: e.target.value })}
                  placeholder="DZenix Logo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="contact@dzenix.com"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+213 XXX XX XX XX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address_en">Address (English)</Label>
                <Input
                  id="address_en"
                  value={formData.address_en}
                  onChange={(e) => setFormData({ ...formData, address_en: e.target.value })}
                  placeholder="Algiers, Algeria"
                />
              </div>
              <div>
                <Label htmlFor="address_fr">Address (French)</Label>
                <Input
                  id="address_fr"
                  value={formData.address_fr}
                  onChange={(e) => setFormData({ ...formData, address_fr: e.target.value })}
                  placeholder="Alger, Algérie"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address_ar">Address (Arabic)</Label>
                <Input
                  id="address_ar"
                  value={formData.address_ar}
                  onChange={(e) => setFormData({ ...formData, address_ar: e.target.value })}
                  placeholder="الجزائر، الجزائر"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="address_de">Address (German)</Label>
                <Input
                  id="address_de"
                  value={formData.address_de}
                  onChange={(e) => setFormData({ ...formData, address_de: e.target.value })}
                  placeholder="Algier, Algerien"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp_number_1">WhatsApp Number 1</Label>
                <Input
                  id="whatsapp_number_1"
                  value={formData.whatsapp_number_1}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number_1: e.target.value })}
                  placeholder="+43 660 8439375"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp_number_2">WhatsApp Number 2</Label>
                <Input
                  id="whatsapp_number_2"
                  value={formData.whatsapp_number_2}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number_2: e.target.value })}
                  placeholder="+43 660 2313221"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp_message_en">WhatsApp Message (English)</Label>
                <Textarea
                  id="whatsapp_message_en"
                  value={formData.whatsapp_message_en}
                  onChange={(e) => setFormData({ ...formData, whatsapp_message_en: e.target.value })}
                  placeholder="Hello! I would like to inquire about your services."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp_message_fr">WhatsApp Message (French)</Label>
                <Textarea
                  id="whatsapp_message_fr"
                  value={formData.whatsapp_message_fr}
                  onChange={(e) => setFormData({ ...formData, whatsapp_message_fr: e.target.value })}
                  placeholder="Bonjour! Je voudrais me renseigner sur vos services."
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp_message_ar">WhatsApp Message (Arabic)</Label>
                <Textarea
                  id="whatsapp_message_ar"
                  value={formData.whatsapp_message_ar}
                  onChange={(e) => setFormData({ ...formData, whatsapp_message_ar: e.target.value })}
                  placeholder="مرحباً! أود الاستفسار عن خدماتكم."
                  rows={3}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp_message_de">WhatsApp Message (German)</Label>
                <Textarea
                  id="whatsapp_message_de"
                  value={formData.whatsapp_message_de}
                  onChange={(e) => setFormData({ ...formData, whatsapp_message_de: e.target.value })}
                  placeholder="Hallo! Ich würde gerne mehr über Ihre Dienstleistungen erfahren."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="social_facebook">Facebook URL</Label>
                <Input
                  id="social_facebook"
                  value={formData.social_facebook}
                  onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/dzenix"
                />
              </div>
              <div>
                <Label htmlFor="social_twitter">Twitter URL</Label>
                <Input
                  id="social_twitter"
                  value={formData.social_twitter}
                  onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                  placeholder="https://twitter.com/dzenix"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                <Input
                  id="social_linkedin"
                  value={formData.social_linkedin}
                  onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/dzenix"
                />
              </div>
              <div>
                <Label htmlFor="social_instagram">Instagram URL</Label>
                <Input
                  id="social_instagram"
                  value={formData.social_instagram}
                  onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                  placeholder="https://instagram.com/dzenix"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#2563eb"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moroccan Zellige Pattern Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input
                id="pattern_enabled"
                type="checkbox"
                checked={formData.pattern_enabled}
                onChange={(e) => setFormData({ ...formData, pattern_enabled: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
              <Label htmlFor="pattern_enabled" className="cursor-pointer text-base font-semibold">
                Enable Geometric Pattern Globally
              </Label>
            </div>

            {formData.pattern_enabled && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="pattern_opacity_light">Light Background Opacity</Label>
                      <span className="text-sm font-semibold text-blue-600">{formData.pattern_opacity_light}%</span>
                    </div>
                    <Input
                      id="pattern_opacity_light"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.pattern_opacity_light}
                      onChange={(e) => setFormData({ ...formData, pattern_opacity_light: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Pattern opacity on white/light sections (recommended: 10-15)
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="pattern_opacity_dark">Dark Background Opacity</Label>
                      <span className="text-sm font-semibold text-blue-600">{formData.pattern_opacity_dark}%</span>
                    </div>
                    <Input
                      id="pattern_opacity_dark"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.pattern_opacity_dark}
                      onChange={(e) => setFormData({ ...formData, pattern_opacity_dark: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Pattern opacity on blue/dark sections (recommended: 15-25)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="pattern_scale">Pattern Size</Label>
                      <span className="text-sm font-semibold text-blue-600">{formData.pattern_scale}px</span>
                    </div>
                    <Input
                      id="pattern_scale"
                      type="range"
                      min="320"
                      max="520"
                      step="10"
                      value={formData.pattern_scale}
                      onChange={(e) => setFormData({ ...formData, pattern_scale: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Size of pattern tiles in pixels (320-520px)
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="pattern_stroke_width">Line Thickness</Label>
                      <span className="text-sm font-semibold text-blue-600">{formData.pattern_stroke_width}px</span>
                    </div>
                    <Input
                      id="pattern_stroke_width"
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={formData.pattern_stroke_width}
                      onChange={(e) => setFormData({ ...formData, pattern_stroke_width: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Thickness of pattern lines (recommended: 1.0-2.0)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pattern_color_light">Light Background Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="pattern_color_light"
                        type="color"
                        value={formData.pattern_color_light}
                        onChange={(e) => setFormData({ ...formData, pattern_color_light: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        value={formData.pattern_color_light}
                        onChange={(e) => setFormData({ ...formData, pattern_color_light: e.target.value })}
                        placeholder="#2563eb"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pattern color on white/light backgrounds
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="pattern_color_dark">Dark Background Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="pattern_color_dark"
                        type="color"
                        value={formData.pattern_color_dark}
                        onChange={(e) => setFormData({ ...formData, pattern_color_dark: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        value={formData.pattern_color_dark}
                        onChange={(e) => setFormData({ ...formData, pattern_color_dark: e.target.value })}
                        placeholder="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pattern color on blue/dark backgrounds
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Enable Pattern on Sections</Label>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { id: 'hero', label: 'Hero' },
                      { id: 'services', label: 'Services' },
                      { id: 'why-choose', label: 'Why Choose Us' },
                      { id: 'process', label: 'Process' },
                      { id: 'who-we-work-with', label: 'Who We Work With' },
                      { id: 'cta', label: 'CTA' },
                      { id: 'footer', label: 'Footer' },
                      { id: 'contact', label: 'Contact' }
                    ].map((section) => (
                      <label key={section.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.pattern_enabled_sections.includes(section.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                pattern_enabled_sections: [...formData.pattern_enabled_sections, section.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                pattern_enabled_sections: formData.pattern_enabled_sections.filter(s => s !== section.id)
                              });
                            }
                          }}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm font-medium">{section.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Select which sections should display the Moroccan Zellige pattern
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
