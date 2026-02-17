import { Header } from '@/components/frontend/Header';
import { Footer } from '@/components/frontend/Footer';
import { PatternOverlay } from '@/components/frontend/PatternOverlay';
import { isRTL } from '@/lib/cms/utils';

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const language = params.lang;
  const rtl = isRTL(language);

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} lang={language}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PatternOverlay sectionId="global" theme="light" />
      </div>

      <div className="relative z-10">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}