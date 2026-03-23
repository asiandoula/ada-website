'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ada-cookie-consent');
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('ada-cookie-consent', 'accepted');
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('ada-cookie-consent', 'declined');
    // Disable GA if declined
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)['ga-disable-G-P7D4D4SEHL'] = true;
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-ada-navy rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-white text-sm leading-relaxed">
            We use cookies and Google Analytics to understand how visitors use our site and improve your experience.
            No personal health information is collected.{' '}
            <Link href="/support/faq" className="text-ada-purple-hover underline underline-offset-2">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors font-outfit"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm bg-ada-purple text-white font-outfit font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
