'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Subscribed! Welcome to the ADA community.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-white/70">{message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
        placeholder="Your email"
        required
        aria-label="Email address for newsletter"
        className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-white/10 text-white text-sm placeholder:text-white/60 border border-white/10 focus:outline-none focus:border-white/30"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 px-4 py-2.5 rounded-full bg-ada-purple text-white text-sm font-medium hover:bg-ada-purple-hover transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="absolute mt-12 text-xs text-red-300">{message}</p>
      )}
    </form>
  );
}
