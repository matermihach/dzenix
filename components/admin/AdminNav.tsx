'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/firebase/auth';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Palette,
  Search
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/faqs', label: 'FAQs', icon: MessageSquare },
  { href: '/admin/leads', label: 'Leads', icon: Mail },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/theme', label: 'Theme', icon: Palette },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      router.push('/admin/login');
    }
  }

  return (
    <nav className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white min-h-screen p-6 shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src="/dzenix.png"
            alt="DZenix"
            width={40}
            height={40}
            className="object-contain bg-white rounded-lg p-1"
          />
          <h1 className="text-2xl font-bold">DZenix</h1>
        </div>
        <p className="text-sm text-blue-200">Admin Panel</p>
      </div>

      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-md font-semibold'
                    : 'hover:bg-blue-600 text-blue-100'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-8">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-blue-600 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut size={20} className="mr-3" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
