'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Briefcase, X } from 'lucide-react';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import { Service } from '@/lib/cms/types';

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    icon: 'Code',
    title_en: '',
    title_fr: '',
    title_ar: '',
    title_de: '',
    description_en: '',
    description_fr: '',
    description_ar: '',
    description_de: '',
    features_en: [''],
    features_fr: [''],
    features_ar: [''],
    features_de: [''],
    price_range_dzd: '',
    price_range_eur: '',
    price_range_usd: '',
    is_featured: false,
    display_order: 1,
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    const data = await getCollection('services');
    setServices(data as Service[]);
    setLoading(false);
  }

  function openCreateDialog() {
    setEditingService(null);
    setFormData({
      slug: '',
      icon: 'Code',
      title_en: '',
      title_fr: '',
      title_ar: '',
      title_de: '',
      description_en: '',
      description_fr: '',
      description_ar: '',
      description_de: '',
      features_en: [''],
      features_fr: [''],
      features_ar: [''],
      features_de: [''],
      price_range_dzd: '',
      price_range_eur: '',
      price_range_usd: '',
      is_featured: false,
      display_order: services.length + 1,
    });
    setDialogOpen(true);
  }

  function openEditDialog(service: Service) {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      icon: service.icon,
      title_en: service.title_en,
      title_fr: service.title_fr,
      title_ar: service.title_ar || '',
      title_de: service.title_de || '',
      description_en: service.description_en,
      description_fr: service.description_fr,
      description_ar: service.description_ar || '',
      description_de: service.description_de || '',
      features_en: service.features_en.length > 0 ? service.features_en : [''],
      features_fr: service.features_fr.length > 0 ? service.features_fr : [''],
      features_ar: service.features_ar && service.features_ar.length > 0 ? service.features_ar : [''],
      features_de: service.features_de && service.features_de.length > 0 ? service.features_de : [''],
      price_range_dzd: service.price_range_dzd || '',
      price_range_eur: service.price_range_eur || '',
      price_range_usd: service.price_range_usd || '',
      is_featured: service.is_featured,
      display_order: service.display_order,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!formData.slug || !formData.title_en || !formData.title_fr) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      ...formData,
      features_en: formData.features_en.filter(f => f.trim() !== ''),
      features_fr: formData.features_fr.filter(f => f.trim() !== ''),
      features_ar: formData.features_ar.filter(f => f.trim() !== ''),
      features_de: formData.features_de.filter(f => f.trim() !== ''),
    };

    if (editingService) {
      const { error } = await updateDocument('services', editingService.id, data);
      if (error) {
        toast.error('Failed to update service: ' + error);
      } else {
        toast.success('Service updated successfully');
        setDialogOpen(false);
        loadServices();
      }
    } else {
      const { error } = await addDocument('services', data);
      if (error) {
        toast.error('Failed to create service: ' + error);
      } else {
        toast.success('Service created successfully');
        setDialogOpen(false);
        loadServices();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await deleteDocument('services', id);
    if (error) {
      toast.error('Failed to delete service: ' + error);
    } else {
      toast.success('Service deleted successfully');
      loadServices();
    }
  }

  function addFeature(lang: 'en' | 'fr' | 'ar' | 'de') {
    const field = `features_${lang}` as 'features_en' | 'features_fr' | 'features_ar' | 'features_de';
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  }

  function updateFeature(lang: 'en' | 'fr' | 'ar' | 'de', index: number, value: string) {
    const field = `features_${lang}` as 'features_en' | 'features_fr' | 'features_ar' | 'features_de';
    const features = [...formData[field]];
    features[index] = value;
    setFormData({ ...formData, [field]: features });
  }

  function removeFeature(lang: 'en' | 'fr' | 'ar' | 'de', index: number) {
    const field = `features_${lang}` as 'features_en' | 'features_fr' | 'features_ar' | 'features_de';
    const features = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: features.length > 0 ? features : [''] });
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Services</h1>
        <p className="text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Services
        </h1>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services
          .sort((a, b) => a.display_order - b.display_order)
          .map((service) => (
            <Card key={service.id} className="border-blue-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <CardTitle className="text-xl mb-1">
                        {service.title_en} / {service.title_fr}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{service.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.is_featured && (
                      <Badge className="bg-blue-600">Featured</Badge>
                    )}
                    <Badge variant="secondary">Order: {service.display_order}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(service)}
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    className="border-red-200 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

        {services.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No services found. Create your first service to get started.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService ? 'Update service details below' : 'Fill in the service details below'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., web-development"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon *</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Lucide icon name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_en">Title (English) *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Service title"
                />
              </div>
              <div>
                <Label htmlFor="title_fr">Title (French) *</Label>
                <Input
                  id="title_fr"
                  value={formData.title_fr}
                  onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                  placeholder="Service title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_ar">Title (Arabic)</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="Service title"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="title_de">Title (German)</Label>
                <Input
                  id="title_de"
                  value={formData.title_de}
                  onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                  placeholder="Service title"
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
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description_fr">Description (French)</Label>
                <Textarea
                  id="description_fr"
                  value={formData.description_fr}
                  onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                  placeholder="Service description"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="Service description"
                  rows={3}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="description_de">Description (German)</Label>
                <Textarea
                  id="description_de"
                  value={formData.description_de}
                  onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
                  placeholder="Service description"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Features (English)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addFeature('en')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.features_en.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature('en', index, e.target.value)}
                      placeholder="Feature"
                    />
                    {formData.features_en.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature('en', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Features (French)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addFeature('fr')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.features_fr.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature('fr', index, e.target.value)}
                      placeholder="Feature"
                    />
                    {formData.features_fr.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature('fr', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Features (Arabic)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addFeature('ar')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.features_ar.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature('ar', index, e.target.value)}
                      placeholder="Feature"
                      dir="rtl"
                    />
                    {formData.features_ar.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature('ar', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Features (German)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addFeature('de')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.features_de.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature('de', index, e.target.value)}
                      placeholder="Feature"
                    />
                    {formData.features_de.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature('de', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price_range_dzd">Price Range (DZD)</Label>
                <Input
                  id="price_range_dzd"
                  value={formData.price_range_dzd}
                  onChange={(e) => setFormData({ ...formData, price_range_dzd: e.target.value })}
                  placeholder="200,000 - 1,000,000 DZD"
                />
              </div>
              <div>
                <Label htmlFor="price_range_eur">Price Range (EUR)</Label>
                <Input
                  id="price_range_eur"
                  value={formData.price_range_eur}
                  onChange={(e) => setFormData({ ...formData, price_range_eur: e.target.value })}
                  placeholder="1,000 - 5,000 €"
                />
              </div>
              <div>
                <Label htmlFor="price_range_usd">Price Range (USD)</Label>
                <Input
                  id="price_range_usd"
                  value={formData.price_range_usd}
                  onChange={(e) => setFormData({ ...formData, price_range_usd: e.target.value })}
                  placeholder="$1,000 - $5,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Service</Label>
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              {editingService ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
