'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { CountdownTimer } from '@/components/exam/countdown-timer';
import { AudioPlayer } from '@/components/exam/audio-player';
import { BiText } from '@/components/exam/bi-text';
import { useExamCopy } from '@/components/exam/exam-copy';
import { ExamBand, ExamH2, examButtonClass } from '@/components/exam/exam-ui';
import { EXAM } from '@/lib/facts';
import { Maximize, Minimize, Pause, Play } from 'lucide-react';

const VALID_LANGS: ExamLang[] = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

type PageState = 'instructions' | 'active';

export default function WrittenExamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang: copyLang, Bi } = useExamCopy();

  const lang = params.lang as string;
  const session = searchParams.get('session');

  const [state, setState] = useState<PageState>('instructions');
  const [startedAt, setStartedAt] = useState<string | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  // Poll exam session
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
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [session]);

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const isValidLang = VALID_LANGS.includes(lang as ExamLang);
  if (!isValidLang) {
    return (
      <div className="ada2-wrap py-16 text-center text-[22px] leading-8 text-ada2-body">
        <Bi k="controls.invalidLanguage" />
      </div>
    );
  }

  const content = getExamContent(lang as ExamLang);
  const enContent = getExamContent('en');
  const title = `${content.ui.part1} · ${content.ui.writtenExam}`;
  const titleEn = `${enContent.ui.part1} · ${enContent.ui.writtenExam}`;
  const bandTitle = (
    <BiText lang={copyLang} main={title} alt={titleEn} altClassName="text-[22px] leading-7 font-light text-ada2-body" />
  );

  const fullscreenButton = (
    <button type="button" onClick={toggleFullscreen} className={examButtonClass('secondary')}>
      {isFullscreen ? <Minimize className="w-5 h-5" aria-hidden="true" /> : <Maximize className="w-5 h-5" aria-hidden="true" />}
      <Bi k={isFullscreen ? 'controls.exitFullscreen' : 'controls.fullscreen'} />
    </button>
  );

  if (state === 'instructions') {
    return (
      <div ref={containerRef} className="flex-1 flex flex-col bg-white [&:fullscreen]:overflow-auto">
        <ExamBand title={bandTitle} right={fullscreenButton} />

        <div className="ada2-wrap pt-10 pb-16">
          <div className="max-w-[1000px] flex flex-col gap-10">
            {/* Audio plays alongside the rules */}
            <AudioPlayer src="/audio/exam/written-instructions.mp3" autoPlay />

            <section aria-labelledby="rules-title" className="flex flex-col gap-4">
              <ExamH2 id="rules-title">
                <Bi k="written.rulesTitle" altClassName="text-[20px] leading-7 font-light text-ada2-body" />
              </ExamH2>
              <ol className="m-0 p-0 list-none border-t-2 border-ada2-ink">
                {content.writtenRules.map((rule, index) => (
                  <li key={index} className="flex gap-5 py-4 border-b border-ada2-hairline">
                    <span className="flex-none w-8 text-[22px] leading-8 font-semibold text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
                      {index + 1}
                    </span>
                    <BiText
                      lang={copyLang}
                      main={rule}
                      alt={enContent.writtenRules[index]}
                      stack
                      className="min-w-0 gap-1 text-[22px] leading-8 text-ada2-ink [text-wrap:pretty]"
                      altClassName="text-[17px] leading-6 text-ada2-body"
                    />
                  </li>
                ))}
              </ol>
            </section>

            <button
              type="button"
              onClick={() => setState('active')}
              className={examButtonClass('primary', { size: 'lg', className: 'w-full sm:w-auto sm:min-w-[360px] self-start' })}
            >
              <BiText lang={copyLang} main={content.ui.beginExam} alt={enContent.ui.beginExam} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active state — big clock, fullscreen optimized
  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-white [&:fullscreen]:overflow-auto">
      <ExamBand
        title={bandTitle}
        right={
          <>
            <button
              type="button"
              onClick={() => setTimerPaused(!timerPaused)}
              className={examButtonClass(timerPaused ? 'primary' : 'secondary')}
            >
              {timerPaused ? (
                <Play className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Pause className="w-5 h-5" aria-hidden="true" />
              )}
              <Bi k={timerPaused ? 'controls.resume' : 'controls.pause'} />
            </button>
            {fullscreenButton}
          </>
        }
      />

      {/* Giant clock */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <p className="m-0 text-[24px] leading-8 text-ada2-body">
          <BiText lang={copyLang} main={content.ui.timeRemaining} alt={enContent.ui.timeRemaining} altClassName="text-ada2-muted" />
        </p>
        <CountdownTimer
          size="lg"
          durationSeconds={3600}
          warningAtSeconds={900}
          startedAt={startedAt}
          paused={timerPaused}
          timeUpLabel={<BiText lang={copyLang} main={content.ui.timeUp} alt={enContent.ui.timeUp} stack className="items-center" />}
        />
        <p className="m-0 text-[20px] leading-7 text-ada2-body [font-variant-numeric:tabular-nums_lining-nums]">
          <Bi k="written.ofMinutes" values={{ minutes: EXAM.writtenMinutes }} altClassName="text-ada2-muted" />
        </p>
      </div>
    </div>
  );
}
