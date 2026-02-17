'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Trash2 } from 'lucide-react';
import { getCollection, deleteDocument } from '@/lib/firebase/firestore';
import { toast } from 'sonner';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  currency: string;
  projectType: string;
  budget: string;
  message?: string;
  language: string;
  status?: string;
  createdAt: any;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    const data = await getCollection('leads');
    setLeads(data as Lead[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    const { error } = await deleteDocument('leads', id);
    if (error) {
      toast.error('Failed to delete lead: ' + error);
    } else {
      toast.success('Lead deleted successfully');
      loadLeads();
    }
  }

  function formatDate(timestamp: any) {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'N/A';
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Leads</h1>
        <p className="text-gray-600">Loading leads...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Leads
        </h1>
        <Badge variant="secondary">{leads.length} Total</Badge>
      </div>

      <div className="grid gap-4">
        {leads
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return bTime - aTime;
          })
          .map((lead) => (
            <Card key={lead.id} className="border-blue-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <CardTitle className="text-xl mb-1">{lead.fullName}</CardTitle>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                      {lead.phone && <p className="text-sm text-gray-600">{lead.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-600 mb-2">{lead.status || 'new'}</Badge>
                    <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="font-medium">{lead.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Currency</p>
                    <p className="font-medium">{lead.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Project Type</p>
                    <p className="font-medium">{lead.projectType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-medium">{lead.budget}</p>
                  </div>
                </div>

                {lead.message && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Message</p>
                    <p className="text-sm">{lead.message}</p>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(lead.id)}
                    className="border-red-200 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

        {leads.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No leads yet. Lead submissions from the contact form will appear here.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
