'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyAdSenseProps {
  adSlot: string;
  style?: React.CSSProperties;
  className?: string;
}

let adSenseLoaded = false;
let adSenseLoading = false;

export default function LazyAdSense({ 
  adSlot, 
  style = { display: 'block', minHeight: '280px' },
  className = ''
}: LazyAdSenseProps) {
  const [userInteracted, setUserInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scriptReady, setScriptReady] = useState(adSenseLoaded);
  const adRef = useRef<HTMLDivElement>(null);

  // Load AdSense only after user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
    };

    // Listen for first user interaction
    const events = ['scroll', 'click', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    if (!userInteracted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [userInteracted]);

  // Load AdSense script when needed
  useEffect(() => {
    if (!isVisible || !userInteracted || scriptReady) return;

    if (adSenseLoaded) {
      setScriptReady(true);
      return;
    }

    if (adSenseLoading) return;

    adSenseLoading = true;

    // Load script with high delay to prioritize core content
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        adSenseLoaded = true;
        adSenseLoading = false;
        setScriptReady(true);
        
        // Initialize ad
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
          console.warn('AdSense initialization error:', error);
        }
      };

      script.onerror = () => {
        adSenseLoading = false;
        console.warn('AdSense script failed to load');
      };

      document.head.appendChild(script);
    }, 3000); // 3 second delay
  }, [isVisible, userInteracted, scriptReady]);

  return (
    <div ref={adRef} className={`lazy-ad-container ${className}`} style={style}>
      {scriptReady ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : userInteracted ? (
        <div 
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%)',
            backgroundSize: '400% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px'
          }}
        >
          Ładowanie reklamy...
        </div>
      ) : (
        <div 
          style={{
            height: '100%',
            border: '2px dashed #ddd',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          onClick={() => setUserInteracted(true)}
        >
          Kliknij aby załadować reklamę
        </div>
      )}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}