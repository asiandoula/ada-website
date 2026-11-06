'use client';

/**
 * "Write to ADA": the contact form these pages already had (legacy
 * components/public/contact-form.tsx), restyled for Direction C.
 *
 * Behaviour is unchanged: it POSTs the same JSON body
 * { full_name, phone, email, topic, message } to /api/contact, with the same
 * required fields, the same topic values (English, as the admin inbox expects)
 * and the same SMS consent disclosure under the phone field.
 */
import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CONTACT } from '@/lib/facts';
import { cn } from '@/lib/utils';

const EMPTY = { full_name: '', phone: '', email: '', topic: '', message: '' };

/** Values stored by /api/contact. Labels are translated; values never are. */
const TOPIC_VALUES = ['Becoming a Doula', 'Hiring a Doula', 'Training Programs', 'Other'] as const;

const labelClass = 'text-[15px] leading-5 font-semibold text-ada2-ink';
const fieldClass =
  'w-full min-w-0 box-border bg-white border-[1.5px] border-solid border-ada2-tag-border rounded-[4px] text-ada2-ink text-[17px] font-site appearance-none placeholder:text-ada2-muted';

function ChevronDown() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="#111827"
      strokeWidth={1.6}
      aria-hidden
      focusable={false}
      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
    >
      <path d="M3.5 6L8 10.5 12.5 6" />
    </svg>
  );
}

export function ContactBand({ id = 'contact-ada' }: { id?: string }) {
  const t = useTranslations('findDoula.contact');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const topics: Record<(typeof TOPIC_VALUES)[number], string> = {
    'Becoming a Doula': t('topicBecoming'),
    'Hiring a Doula': t('topicHiring'),
    'Training Programs': t('topicTraining'),
    Other: t('topicOther'),
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error((data as { error?: string }).error || t('error'));
        return;
      }
      toast.success(t('success'));
      setForm(EMPTY);
    } catch {
      toast.error(t('network', { email: CONTACT.email }));
    } finally {
      setLoading(false);
    }
  }

  const f = (name: string) => `${id}-${name}`;

  return (
    <section aria-labelledby={`${id}-title`} className="bg-ada2-band border-y border-ada2-band-rule print:hidden">
      <div className="ada2-wrap pt-12 pb-[52px] flex flex-wrap items-start gap-x-16 gap-y-8">
        <div className="flex-[1_1_300px] max-w-[440px] min-w-0 flex flex-col gap-4">
          <h2 id={`${id}-title`} className="m-0 text-[clamp(30px,2.5vw,36px)] leading-[1.22] font-light text-ada2-ink [text-wrap:balance]">
            {t('title')}
          </h2>
          <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('body')}</p>
          <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
            <div className="flex flex-wrap gap-x-6 gap-y-0.5 py-2 border-b border-ada2-hairline">
              <dt className="flex-[0_0_80px] font-semibold text-ada2-ink self-center">{t('emailLabel')}</dt>
              <dd className="m-0 min-w-0">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center min-h-[44px] text-ada2-ink underline underline-offset-[3px] hover:text-black"
                >
                  {CONTACT.email}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-0.5 py-2 border-b border-ada2-hairline">
              <dt className="flex-[0_0_80px] font-semibold text-ada2-ink self-center">{t('phoneLabel')}</dt>
              <dd className="m-0 min-w-0">
                <a
                  href={`tel:${CONTACT.phone.tel}`}
                  className="inline-flex items-center min-h-[44px] text-ada2-ink underline underline-offset-[3px] hover:text-black [font-variant-numeric:tabular-nums_lining-nums]"
                >
                  {CONTACT.phone.display}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="flex-[1_1_520px] min-w-0 flex flex-col gap-5" aria-labelledby={`${id}-title`}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-4 gap-y-5">
            <div className="flex flex-col gap-2 min-w-0">
              <label htmlFor={f('name')} className={labelClass}>
                {t('nameLabel')}
              </label>
              <input
                id={f('name')}
                type="text"
                required
                autoComplete="name"
                value={form.full_name}
                onChange={set('full_name')}
                className={cn(fieldClass, 'h-12 px-3.5')}
              />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <label htmlFor={f('email')} className={labelClass}>
                {t('emailFieldLabel')}
              </label>
              <input
                id={f('email')}
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                className={cn(fieldClass, 'h-12 px-3.5')}
              />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <label htmlFor={f('phone')} className={labelClass}>
                {t('phoneFieldLabel')}
              </label>
              <input
                id={f('phone')}
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set('phone')}
                aria-describedby={f('sms')}
                className={cn(fieldClass, 'h-12 px-3.5')}
              />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <label htmlFor={f('topic')} className={labelClass}>
                {t('topicLabel')}
              </label>
              <span className="relative block">
                <select
                  id={f('topic')}
                  value={form.topic}
                  onChange={set('topic')}
                  className={cn(fieldClass, 'h-12 pl-3.5 pr-11 cursor-pointer')}
                >
                  <option value="">{t('topicPlaceholder')}</option>
                  {TOPIC_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {topics[v]}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </span>
            </div>
          </div>

          {/* SMS consent disclosure (toll-free verification opt-in evidence, 2026-09-28). */}
          <p id={f('sms')} className="m-0 -mt-1 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
            {t.rich('smsConsent', {
              privacy: (chunks) => (
                <a href="/privacy-policy" className="text-ada2-ink underline underline-offset-[3px] hover:text-black">
                  {chunks}
                </a>
              ),
              terms: (chunks) => (
                <a href="/terms-of-service" className="text-ada2-ink underline underline-offset-[3px] hover:text-black">
                  {chunks}
                </a>
              ),
            })}
          </p>

          <div className="flex flex-col gap-2 min-w-0">
            <label htmlFor={f('message')} className={labelClass}>
              {t('messageLabel')}
            </label>
            <textarea
              id={f('message')}
              required
              rows={5}
              value={form.message}
              onChange={set('message')}
              className={cn(fieldClass, 'block px-3.5 py-3 leading-[1.5] resize-y min-h-[132px]')}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading || undefined}
              className="inline-flex items-center justify-center min-h-[48px] box-border px-7 rounded-full border-[1.5px] border-solid border-ada2-ink bg-ada2-ink text-white text-[16px] leading-5 font-semibold whitespace-nowrap cursor-pointer transition-colors hover:bg-black hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t('sending') : t('submit')}
            </button>
            <p className="m-0 text-[14px] leading-[21px] text-ada2-muted">{t('requiredNote')}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
