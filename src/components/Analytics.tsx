"use client";

import { useEffect } from 'react';
import { getCookie } from '@/lib/cookies';

export default function Analytics() {
  useEffect(() => {
    const handler = () => {
      // Load Google Analytics only after consent
      // Note: Replace G-XXXXXXX with your actual Measurement ID
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
      script.async = true;
      document.head.appendChild(script);
      
      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      function gtag(){window.dataLayer.push(arguments);}
      // @ts-ignore
      gtag('js', new Date());
      // @ts-ignore
      gtag('config', 'G-XXXXXXX');
    };

    if (getCookie('karna_consent') === 'accepted') {
      handler();
    } else {
      window.addEventListener('cookie-consent-accepted', handler, { once: true });
    }

    return () => window.removeEventListener('cookie-consent-accepted', handler);
  }, []);

  return null;
}
