'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

interface AdsByGoogleAd {
  [key: string]: unknown;
}

declare global {
  interface Window {
    adsbygoogle: AdsByGoogleAd[];
  }
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={responsive.toString()}
    />
  );
}