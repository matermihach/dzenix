'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import { FAQ } from '@/lib/cms/types';

export default function FAQsManagementPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question_en: '',
    question_fr: '',
    question_ar: '',
    question_de: '',
    answer_en: '',
    answer_fr: '',
    answer_ar: '',
    answer_de: '',
    category: 'general',
    display_order: 1,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    setLoading(true);
    const data = await getCollection('faqs');
    setFaqs(data as FAQ[]);
    setLoading(false);
  }

  function openCreateDialog() {
    setEditingFAQ(null);
    setFormData({
      question_en: '',
      question_fr: '',
      question_ar: '',
      question_de: '',
      answer_en: '',
      answer_fr: '',
      answer_ar: '',
      answer_de: '',
      category: 'general',
      display_order: faqs.length + 1,
    });
    setDialogOpen(true);
  }

  function openEditDialog(faq: FAQ) {
    setEditingFAQ(faq);
    setFormData({
      question_en: faq.question_en,
      question_fr: faq.question_fr,
      question_ar: faq.question_ar || '',
      question_de: faq.question_de || '',
      answer_en: faq.answer_en,
      answer_fr: faq.answer_fr,
      answer_ar: faq.answer_ar || '',
      answer_de: faq.answer_de || '',
      category: faq.category,
      display_order: faq.display_order,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!formData.question_en || !formData.question_fr || !formData.answer_en || !formData.answer_fr) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingFAQ) {
      const { error } = await updateDocument('faqs', editingFAQ.id, formData);
      if (error) {
        toast.error('Failed to update FAQ: ' + error);
      } else {
        toast.success('FAQ updated successfully');
        setDialogOpen(false);
        loadFAQs();
      }
    } else {
      const { error } = await addDocument('faqs', formData);
      if (error) {
        toast.error('Failed to create FAQ: ' + error);
      } else {
        toast.success('FAQ created successfully');
        setDialogOpen(false);
        loadFAQs();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const { error } = await deleteDocument('faqs', id);
    if (error) {
      toast.error('Failed to delete FAQ: ' + error);
    } else {
      toast.success('FAQ deleted successfully');
      loadFAQs();
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">FAQs</h1>
        <p className="text-gray-600">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          FAQs
        </h1>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New FAQ
        </Button>
      </div>

      <div className="grid gap-4">
        {faqs
          .sort((a, b) => a.display_order - b.display_order)
          .map((faq) => (
            <Card key={faq.id} className="border-blue-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{faq.question_en}</CardTitle>
                      <p className="text-sm text-gray-600">{faq.answer_en.substring(0, 150)}...</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(faq)}
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(faq.id)}
                    className="border-red-200 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

        {faqs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No FAQs found. Create your first FAQ to get started.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}</DialogTitle>
            <DialogDescription>
              {editingFAQ ? 'Update FAQ details below' : 'Fill in the FAQ details below'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="question_en">Question (English) *</Label>
                <Textarea
                  id="question_en"
                  value={formData.question_en}
                  onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
                  placeholder="Question in English"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="question_fr">Question (French) *</Label>
                <Textarea
                  id="question_fr"
                  value={formData.question_fr}
                  onChange={(e) => setFormData({ ...formData, question_fr: e.target.value })}
                  placeholder="Question in French"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="question_ar">Question (Arabic)</Label>
                <Textarea
                  id="question_ar"
                  value={formData.question_ar}
                  onChange={(e) => setFormData({ ...formData, question_ar: e.target.value })}
                  placeholder="Question in Arabic"
                  rows={2}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="question_de">Question (German)</Label>
                <Textarea
                  id="question_de"
                  value={formData.question_de}
                  onChange={(e) => setFormData({ ...formData, question_de: e.target.value })}
                  placeholder="Question in German"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="answer_en">Answer (English) *</Label>
                <Textarea
                  id="answer_en"
                  value={formData.answer_en}
                  onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })}
                  placeholder="Answer in English"
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="answer_fr">Answer (French) *</Label>
                <Textarea
                  id="answer_fr"
                  value={formData.answer_fr}
                  onChange={(e) => setFormData({ ...formData, answer_fr: e.target.value })}
                  placeholder="Answer in French"
                  rows={5}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="answer_ar">Answer (Arabic)</Label>
                <Textarea
                  id="answer_ar"
                  value={formData.answer_ar}
                  onChange={(e) => setFormData({ ...formData, answer_ar: e.target.value })}
                  placeholder="Answer in Arabic"
                  rows={5}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="answer_de">Answer (German)</Label>
                <Textarea
                  id="answer_de"
                  value={formData.answer_de}
                  onChange={(e) => setFormData({ ...formData, answer_de: e.target.value })}
                  placeholder="Answer in German"
                  rows={5}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., general, pricing, technical"
                />
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
              {editingFAQ ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
