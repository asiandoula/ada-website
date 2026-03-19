'use client';

import { useState, type FormEvent } from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    topic: '',
    message: '',
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong. Please try again.');
        return;
      }

      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ full_name: '', phone: '', email: '', topic: '', message: '' });
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-ada-purple via-ada-purple-accent to-purple-300" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Info */}
          <div className="text-white">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold leading-tight">
              Let&apos;s Connect and Support Families Together!
            </h2>
            <p className="mt-4 text-white/80 text-lg leading-relaxed">
              Whether you&apos;re interested in becoming a certified doula, looking for
              postpartum support, or want to learn more about our programs, we&apos;d
              love to hear from you.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Phone</div>
                  <a href="tel:+17142026501" className="hover:underline">+1 (714) 202-6501</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Email</div>
                  <a href="mailto:contact@asiandoula.org" className="hover:underline">contact@asiandoula.org</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Hours</div>
                  <div>Mon - Fri, 10AM - 5PM PST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-ada-navy mb-1.5">
                  Full Name <span className="text-ada-red">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/40 focus:border-ada-purple"
                  placeholder="Your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-ada-navy mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/40 focus:border-ada-purple"
                  placeholder="(123) 456-7890"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ada-navy mb-1.5">
                  Email <span className="text-ada-red">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/40 focus:border-ada-purple"
                  placeholder="you@example.com"
                />
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-ada-navy mb-1.5">
                  Topic
                </label>
                <select
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData((p) => ({ ...p, topic: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/40 focus:border-ada-purple bg-white"
                >
                  <option value="">I&apos;m interested in...</option>
                  <option value="Becoming a Doula">Becoming a Doula</option>
                  <option value="Hiring a Doula">Hiring a Doula</option>
                  <option value="Training Programs">Training Programs</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ada-navy mb-1.5">
                  Message <span className="text-ada-red">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/40 focus:border-ada-purple resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-ada-purple px-6 py-3 text-white font-semibold transition-colors hover:bg-ada-purple-accent disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
