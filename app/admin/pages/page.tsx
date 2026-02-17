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
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import { Page } from '@/lib/cms/types';

export default function PagesManagementPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title_en: '',
    title_fr: '',
    title_ar: '',
    title_de: '',
    meta_title_en: '',
    meta_title_fr: '',
    meta_title_ar: '',
    meta_title_de: '',
    meta_description_en: '',
    meta_description_fr: '',
    meta_description_ar: '',
    meta_description_de: '',
    is_published: true,
  });

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    const data = await getCollection('pages');
    setPages(data as Page[]);
    setLoading(false);
  }

  function openCreateDialog() {
    setEditingPage(null);
    setFormData({
      slug: '',
      title_en: '',
      title_fr: '',
      title_ar: '',
      title_de: '',
      meta_title_en: '',
      meta_title_fr: '',
      meta_title_ar: '',
      meta_title_de: '',
      meta_description_en: '',
      meta_description_fr: '',
      meta_description_ar: '',
      meta_description_de: '',
      is_published: true,
    });
    setDialogOpen(true);
  }

  function openEditDialog(page: Page) {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title_en: page.title_en,
      title_fr: page.title_fr,
      title_ar: page.title_ar || '',
      title_de: page.title_de || '',
      meta_title_en: page.meta_title_en || '',
      meta_title_fr: page.meta_title_fr || '',
      meta_title_ar: page.meta_title_ar || '',
      meta_title_de: page.meta_title_de || '',
      meta_description_en: page.meta_description_en || '',
      meta_description_fr: page.meta_description_fr || '',
      meta_description_ar: page.meta_description_ar || '',
      meta_description_de: page.meta_description_de || '',
      is_published: page.is_published,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!formData.slug || !formData.title_en || !formData.title_fr) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingPage) {
      const { error } = await updateDocument('pages', editingPage.id, formData);
      if (error) {
        toast.error('Failed to update page: ' + error);
      } else {
        toast.success('Page updated successfully');
        setDialogOpen(false);
        loadPages();
      }
    } else {
      const { error } = await addDocument('pages', formData);
      if (error) {
        toast.error('Failed to create page: ' + error);
      } else {
        toast.success('Page created successfully');
        setDialogOpen(false);
        loadPages();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this page?')) return;

    const { error } = await deleteDocument('pages', id);
    if (error) {
      toast.error('Failed to delete page: ' + error);
    } else {
      toast.success('Page deleted successfully');
      loadPages();
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Pages</h1>
        <p className="text-gray-600">Loading pages...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Pages
        </h1>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="border-blue-100 hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {page.title_en} / {page.title_fr}
                    </CardTitle>
                    <p className="text-sm text-gray-600">/{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {page.is_published ? (
                    <Badge className="bg-green-600">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(page)}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                  className="border-red-200 hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {pages.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No pages found. Create your first page to get started.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </DialogTitle>
            <DialogDescription>
              {editingPage ? 'Update page details below' : 'Fill in the page details below'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., about, contact"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_en">Title (English) *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Page title in English"
                />
              </div>
              <div>
                <Label htmlFor="title_fr">Title (French) *</Label>
                <Input
                  id="title_fr"
                  value={formData.title_fr}
                  onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                  placeholder="Page title in French"
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
                  placeholder="Page title in Arabic"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="title_de">Title (German)</Label>
                <Input
                  id="title_de"
                  value={formData.title_de}
                  onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                  placeholder="Page title in German"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_title_en">Meta Title (English)</Label>
                <Input
                  id="meta_title_en"
                  value={formData.meta_title_en}
                  onChange={(e) => setFormData({ ...formData, meta_title_en: e.target.value })}
                  placeholder="SEO title"
                />
              </div>
              <div>
                <Label htmlFor="meta_title_fr">Meta Title (French)</Label>
                <Input
                  id="meta_title_fr"
                  value={formData.meta_title_fr}
                  onChange={(e) => setFormData({ ...formData, meta_title_fr: e.target.value })}
                  placeholder="SEO title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_title_ar">Meta Title (Arabic)</Label>
                <Input
                  id="meta_title_ar"
                  value={formData.meta_title_ar}
                  onChange={(e) => setFormData({ ...formData, meta_title_ar: e.target.value })}
                  placeholder="SEO title"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="meta_title_de">Meta Title (German)</Label>
                <Input
                  id="meta_title_de"
                  value={formData.meta_title_de}
                  onChange={(e) => setFormData({ ...formData, meta_title_de: e.target.value })}
                  placeholder="SEO title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_description_en">Meta Description (English)</Label>
                <Textarea
                  id="meta_description_en"
                  value={formData.meta_description_en}
                  onChange={(e) => setFormData({ ...formData, meta_description_en: e.target.value })}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="meta_description_fr">Meta Description (French)</Label>
                <Textarea
                  id="meta_description_fr"
                  value={formData.meta_description_fr}
                  onChange={(e) => setFormData({ ...formData, meta_description_fr: e.target.value })}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_description_ar">Meta Description (Arabic)</Label>
                <Textarea
                  id="meta_description_ar"
                  value={formData.meta_description_ar}
                  onChange={(e) => setFormData({ ...formData, meta_description_ar: e.target.value })}
                  placeholder="SEO description"
                  rows={3}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="meta_description_de">Meta Description (German)</Label>
                <Textarea
                  id="meta_description_de"
                  value={formData.meta_description_de}
                  onChange={(e) => setFormData({ ...formData, meta_description_de: e.target.value })}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published">Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              {editingPage ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
