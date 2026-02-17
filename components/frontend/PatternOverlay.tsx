'use client';

import { useSiteSettings } from '@/lib/cms/hooks';
import { useEffect, useState } from 'react';

interface PatternOverlayProps {
  sectionId: string;
  theme?: 'light' | 'dark';
}

export function PatternOverlay({
  sectionId,
  theme = 'light'
}: PatternOverlayProps) {
  const { settings } = useSiteSettings();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!settings?.pattern_enabled) {
    return null;
  }

  if (!settings.pattern_enabled_sections?.includes(sectionId)) {
    return null;
  }

  const baseOpacity = theme === 'light'
    ? settings.pattern_opacity_light / 100
    : settings.pattern_opacity_dark / 100;

  const opacity = isMobile ? baseOpacity * 0.6 : baseOpacity;

  const patternSize = settings.pattern_scale || 370;
  const mobilePatternSize = Math.max(patternSize * 0.5, 180);
  const finalPatternSize = isMobile ? mobilePatternSize : patternSize;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url('/patterns/zellige.jpg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${finalPatternSize}px ${finalPatternSize}px`,
        opacity: opacity,
        filter: theme === 'dark' ? 'invert(1) brightness(1.5)' : 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
}
