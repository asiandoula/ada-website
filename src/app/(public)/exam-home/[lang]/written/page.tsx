'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { CountdownTimer } from '@/components/exam/countdown-timer';
import { AudioPlayer } from '@/components/exam/audio-player';

const VALID_LANGS: ExamLang[] = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

type PageState = 'instructions' | 'active';

export default function WrittenExamPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const lang = params.lang as string;
  const session = searchParams.get('session');

  const [state, setState] = useState<PageState>('instructions');
  const [startedAt, setStartedAt] = useState<string | undefined>(undefined);

  // Poll exam session every 5 seconds if session param exists
  useEffect(() => {
    if (!session) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/exam-session?code=${session}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'active' && data.exam_part === 'written') {
          setStartedAt(data.startedAt);
          setState('active');
        }
      } catch {
        // Silently ignore poll errors
      }
    };

    // Poll immediately, then every 5 seconds
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [session]);

  // Validate lang — after all hooks
  const isValidLang = VALID_LANGS.includes(lang as ExamLang);

  if (!isValidLang) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-zinc-500">
        Invalid language.
      </div>
    );
  }

  const content = getExamContent(lang as ExamLang);
  const title = `${content.ui.part1} ${content.ui.writtenExam}`;

  if (state === 'instructions') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-dm-serif text-2xl text-ada-navy text-center mb-8">
          {title}
        </h1>

        <div className="mb-8">
          <AudioPlayer src="/audio/exam/written-instructions.mp3" />
        </div>

        <ol className="space-y-3 text-sm text-zinc-600 mb-8">
          {content.writtenRules.map((rule, index) => (
            <li key={index} className="flex gap-3">
              <span className="shrink-0 font-semibold text-ada-navy">
                {index + 1}.
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>

        <button
          onClick={() => setState('active')}
          className="w-full py-4 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-lg hover:bg-ada-purple/90 transition"
        >
          {content.ui.beginExam}
        </button>
      </div>
    );
  }

  // Active state
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-dm-serif text-2xl text-ada-navy text-center mb-8">
        {title}
      </h1>

      <div className="flex flex-col items-center justify-center">
        <CountdownTimer
          size="lg"
          durationSeconds={3600}
          warningAtSeconds={900}
          startedAt={startedAt}
        />
      </div>
    </div>
  );
}
