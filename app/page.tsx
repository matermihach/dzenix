'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguagePreference } from '@/lib/cms/utils';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lang = getLanguagePreference();
    router.push(`/${lang}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}
