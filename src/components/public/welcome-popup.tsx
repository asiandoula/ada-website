'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShieldCheck } from 'lucide-react';

export function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ada-popup-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleClose() {
    setVisible(false);
    sessionStorage.setItem('ada-popup-dismissed', 'true');
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubStatus('success');
        setEmail('');
      } else {
        setSubStatus('error');
      }
    } catch {
      setSubStatus('error');
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[90] animate-in fade-in duration-300" onClick={handleClose} />

      {/* Popup */}
      <div className="fixed bottom-6 right-6 z-[95] w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-ada-navy px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-ada-purple" />
            <span className="font-outfit font-semibold text-white text-sm">Asian Doula Alliance</span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close popup"
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Verify CTA */}
          <div>
            <p className="font-outfit text-sm text-ada-navy/70 leading-relaxed">
              Need to verify a doula&apos;s certification? Search by name, ID, or certificate number.
            </p>
            <Link
              href="/verify"
              onClick={handleClose}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-outfit font-medium hover:bg-ada-purple-hover transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify a Doula
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-ada-navy/30 font-outfit">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-outfit text-xs text-ada-navy/50 mb-2">
              Subscribe for training updates &amp; certification news
            </p>
            {subStatus === 'success' ? (
              <p className="text-sm text-green-600 font-outfit">Subscribed! Welcome to the ADA community.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSubStatus('idle'); }}
                  placeholder="Your email"
                  required
                  aria-label="Email for newsletter"
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-ada-purple/30"
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="shrink-0 px-4 py-2 rounded-lg bg-ada-navy text-white text-xs font-outfit font-medium hover:bg-ada-navy-warm transition-colors disabled:opacity-50"
                >
                  {subStatus === 'loading' ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
            {subStatus === 'error' && (
              <p className="mt-1 text-xs text-red-500 font-outfit">Something went wrong. Try again.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
