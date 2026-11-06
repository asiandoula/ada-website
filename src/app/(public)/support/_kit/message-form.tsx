'use client';

/**
 * "Send a message" (Support board), wired to POST /api/contact.
 *
 * The API receives exactly what the previous ContactForm sent:
 *   { full_name, phone, email, topic, message }
 * Topic values stay the English strings in INQUIRY_TOPICS (the admin inbox
 * keys its colours on them); only the visible labels are translated.
 * The phone field keeps its SMS consent text (toll-free verification
 * opt-in evidence, 2026-09-28).
 */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { pillClassName } from '@/components/site/pill';
import { CONTACT } from '@/lib/facts';
import { INQUIRY_TOPICS } from '@/lib/inquiries';
import { cn } from '@/lib/utils';
import { inlineLink } from './page-shell';

type Topic = (typeof INQUIRY_TOPICS)[number];

/** Option order of the previous public form. */
const TOPIC_ORDER: readonly Topic[] = ['Becoming a Doula', 'Hiring a Doula', 'Training Programs', 'Other'];

const EMPTY = { full_name: '', phone: '', email: '', topic: '', message: '' };

const labelClass = 'text-[15px] leading-5 font-semibold text-ada2-ink';
const hintClass = 'm-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]';
const fieldClass =
  'w-full box-border h-12 px-3.5 bg-white border-[1.5px] border-solid border-ada2-tag-border rounded-[4px] text-ada2-ink text-[18px] font-[inherit] appearance-none';

export function MessageForm({ concernHref = '#concern' }: { concernHref?: string }) {
  const t = useTranslations('support.form');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState(EMPTY);

  const topicLabel: Record<Topic, string> = {
    'Becoming a Doula': t('topicBecoming'),
    'Hiring a Doula': t('topicHiring'),
    'Training Programs': t('topicTraining'),
    Other: t('topicOther'),
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text =
          res.status === 429 ? t('errorTooMany') : res.status === 400 ? t('errorInvalid') : t('errorGeneric');
        setStatus({ kind: 'error', text });
        toast.error(text);
        return;
      }

      setStatus({ kind: 'ok', text: t('sent') });
      toast.success(t('sent'));
      setFormData(EMPTY);
    } catch {
      const text = t('errorNetwork', { email: CONTACT.email });
      setStatus({ kind: 'error', text });
      toast.error(text);
    } finally {
      setLoading(false);
    }
  }

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setFormData((p) => ({ ...p, [key]: e.target.value }));

  return (
    <>
      <p className="m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]">
        {t.rich('intro', {
          concern: (chunks) => (
            <a href={concernHref} className={cn(inlineLink, 'whitespace-nowrap')}>
              {chunks}
            </a>
          ),
        })}
      </p>
      <form
        onSubmit={handleSubmit}
        aria-labelledby="message-title"
        className="max-w-[760px] flex flex-col gap-5 pt-6 border-t-2 border-ada2-ink"
      >
        <p className={hintClass}>{t('required')}</p>

        <div className="flex flex-wrap items-start gap-x-4 gap-y-5">
          <div className="flex-[1_1_260px] min-w-0 flex flex-col gap-2">
            <label htmlFor="c-name" className={labelClass}>
              {t('name')}
            </label>
            <input
              id="c-name"
              type="text"
              required
              autoComplete="name"
              value={formData.full_name}
              onChange={set('full_name')}
              className={fieldClass}
            />
          </div>
          <div className="flex-[1_1_260px] min-w-0 flex flex-col gap-2">
            <label htmlFor="c-email" className={labelClass}>
              {t('email')}
            </label>
            <input
              id="c-email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={set('email')}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-4 gap-y-5">
          <div className="flex-[1_1_260px] min-w-0 flex flex-col gap-2">
            <label htmlFor="c-topic" className={labelClass}>
              {t('topic')}
            </label>
            <span className="relative block">
              <select
                id="c-topic"
                value={formData.topic}
                onChange={set('topic')}
                className={cn(fieldClass, 'pr-11 cursor-pointer [-webkit-appearance:none]')}
              >
                <option value="">{t('topicPlaceholder')}</option>
                {TOPIC_ORDER.map((value) => (
                  <option key={value} value={value}>
                    {topicLabel[value]}
                  </option>
                ))}
              </select>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111827"
                strokeWidth="1.8"
                aria-hidden="true"
                focusable="false"
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <path d="M6 9.5l6 6 6-6" />
              </svg>
            </span>
          </div>
          <div className="flex-[1_1_260px] min-w-0 flex flex-col gap-2">
            <label htmlFor="c-phone" className={labelClass}>
              {t('phone')}
            </label>
            <input
              id="c-phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={set('phone')}
              aria-describedby="c-phone-consent"
              className={cn(fieldClass, '[font-variant-numeric:tabular-nums_lining-nums]')}
            />
          </div>
        </div>
        {/* SMS consent disclosure (toll-free verification opt-in evidence, 2026-09-28) */}
        <p id="c-phone-consent" className={hintClass}>
          {t.rich('phoneConsent', {
            privacy: (chunks) => (
              <Link href="/privacy-policy" className={inlineLink}>
                {chunks}
              </Link>
            ),
            terms: (chunks) => (
              <Link href="/terms-of-service" className={inlineLink}>
                {chunks}
              </Link>
            ),
          })}
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="c-msg" className={labelClass}>
            {t('message')}
          </label>
          <textarea
            id="c-msg"
            required
            rows={6}
            value={formData.message}
            onChange={set('message')}
            aria-describedby="c-msg-hint"
            className={cn(fieldClass, 'h-auto min-h-[168px] py-3 leading-[26px] resize-y')}
          />
          <p id="c-msg-hint" className={hintClass}>
            {t('messageHint')}
          </p>
        </div>

        <p className="m-0 text-[15px] leading-[23px] text-ada2-body [text-wrap:pretty]">
          {t.rich('consent', {
            privacy: (chunks) => (
              <Link href="/privacy-policy" className={cn(inlineLink, 'whitespace-nowrap')}>
                {chunks}
              </Link>
            ),
          })}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="submit" disabled={loading} aria-disabled={loading} className={pillClassName('primary', 'md')}>
            {loading ? t('sending') : t('submit')}
          </button>
          <p className={hintClass}>{t('replyNote')}</p>
        </div>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            'm-0 text-[16px] leading-6 font-semibold',
            !status && 'ada2-sr',
            status?.kind === 'ok' && 'text-ada2-good-text',
            status?.kind === 'error' && 'text-ada2-suspended'
          )}
        >
          {status?.text ?? ''}
        </p>
      </form>
    </>
  );
}
