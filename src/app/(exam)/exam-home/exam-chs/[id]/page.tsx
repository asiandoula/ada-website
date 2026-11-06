'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { examButtonClass } from '@/components/exam/exam-ui';

/** The exam ID as typed (route params can arrive percent-encoded, e.g. %23 for #). */
function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function ExamVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('examHome.lookup');
  const id = params.id as string;

  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/exam-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doula_id_code: id, full_name: fullName }),
      });

      if (res.ok) {
        router.push(`/exam-home/exam-chs/${id}/exam-result`);
        return;
      }

      await res.json().catch(() => null);

      if (res.status === 404) {
        setError(t('errors.notFound'));
      } else if (res.status === 429) {
        setError(t('errors.tooMany'));
      } else if (res.status === 401) {
        setError(t('errors.noMatch'));
      } else {
        setError(t('errors.failed'));
      }
    } catch {
      setError(t('errors.network'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ada2-wrap pt-12 pb-20">
      <div className="max-w-[640px] flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
            {t('title')}
          </h1>
          <p className="m-0 text-[22px] leading-[31px] font-light text-ada2-body [text-wrap:pretty]">{t('lead')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="box-border flex flex-col gap-6 px-[clamp(20px,2.4vw,36px)] pt-7 pb-8 bg-ada2-band border-t-2 border-ada2-ink"
        >
          <dl className="m-0 flex flex-col gap-1">
            <dt className="text-[16px] leading-[22px] font-semibold text-ada2-ink">{t('examId')}</dt>
            <dd className="m-0 text-[22px] leading-8 font-semibold text-ada2-blossom [font-variant-numeric:tabular-nums_lining-nums] break-all">
              {safeDecode(id)}
            </dd>
          </dl>

          <div className="flex flex-col gap-2">
            <label htmlFor="full-name" className="text-[16px] leading-[22px] font-semibold text-ada2-ink">
              {t('fullName')}
            </label>
            <input
              id="full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
              aria-describedby="full-name-hint"
              aria-invalid={error ? true : undefined}
              className="w-full min-w-0 box-border h-[56px] px-4 bg-white border-[1.5px] border-solid border-ada2-muted rounded-[4px] text-[18px] text-ada2-ink appearance-none"
            />
            <p id="full-name-hint" className="m-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
              {t('fullNameHint')}
            </p>
          </div>

          {error && (
            <p role="alert" className="m-0 pl-3.5 border-l-4 border-solid border-ada2-suspended text-[16px] leading-6 text-ada2-ink">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !fullName.trim()}
            className={examButtonClass('primary', { className: 'self-start' })}
          >
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
