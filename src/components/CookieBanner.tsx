"use client";

import { useEffect, useState } from 'react';
import { setCookie, getCookie } from '@/lib/cookies';

const CONSENT_COOKIE = 'karna_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if consent not yet stored
    if (!getCookie(CONSENT_COOKIE)) setVisible(true);
  }, []);

  const accept = () => {
    setCookie(CONSENT_COOKIE, 'accepted');
    setVisible(false);
    // Emit a custom event so other parts of the app can react
    window.dispatchEvent(new Event('cookie-consent-accepted'));
  };

  const reject = () => {
    setCookie(CONSENT_COOKIE, 'rejected');
    setVisible(false);
    window.dispatchEvent(new Event('cookie-consent-rejected'));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center justify-between z-50 shadow-lg" role="dialog" aria-live="polite">
      <p className="text-sm">
        We use cookies to improve your experience and analyze traffic.{' '}
        <a href="/privacy-policy" className="underline hover:text-gray-300">Learn more</a>.
      </p>
      <div className="mt-4 sm:mt-0 flex gap-4">
        <button onClick={reject} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 transition-colors rounded text-sm font-semibold">
          Reject All
        </button>
        <button onClick={accept} className="px-6 py-2 bg-primary hover:bg-red-700 transition-colors text-white rounded text-sm font-semibold">
          Accept All
        </button>
      </div>
    </div>
  );
}
