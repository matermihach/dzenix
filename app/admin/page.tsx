'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, Mail, MessageSquare } from 'lucide-react';
import { getCollection } from '@/lib/firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    services: 0,
    leads: 0,
    faqs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [pages, services, leads, faqs] = await Promise.all([
          getCollection('pages'),
          getCollection('services'),
          getCollection('leads'),
          getCollection('faqs'),
        ]);

        setStats({
          pages: pages.length,
          services: services.length,
          leads: leads.length,
          faqs: faqs.length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { title: 'Pages', value: stats.pages, icon: FileText, color: 'text-blue-600', href: '/admin/pages' },
    { title: 'Services', value: stats.services, icon: Briefcase, color: 'text-green-600', href: '/admin/services' },
    { title: 'Leads', value: stats.leads, icon: Mail, color: 'text-orange-600', href: '/admin/leads' },
    { title: 'FAQs', value: stats.faqs, icon: MessageSquare, color: 'text-purple-600', href: '/admin/faqs' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <a key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {loading ? 'Loading...' : 'Click to manage'}
                  </p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to DZenix Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Manage all your website content from this WordPress-like admin panel.
            Edit pages, sections, services, FAQs, view leads, and customize settings without touching code.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
