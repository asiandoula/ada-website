'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { CountdownTimer } from '@/components/exam/countdown-timer';
import { AudioPlayer } from '@/components/exam/audio-player';
import { Maximize, Minimize, Pause, Play, Timer } from 'lucide-react';

const VALID_LANGS: ExamLang[] = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

type PageState = 'instructions' | 'active';

export default function WrittenExamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const lang = params.lang as string;
  const session = searchParams.get('session');

  const [state, setState] = useState<PageState>('instructions');
  const [startedAt, setStartedAt] = useState<string | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

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
          setTimerActive(true); // session-driven → timer starts immediately
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

  function handleBeginExam() {
    // Switch to active state; audio will auto-play and start timer on end
    setState('active');
    setTimerActive(false); // wait for audio to finish
  }

  function handleAudioEnded() {
    setTimerActive(true);
  }

  function startTimerNow() {
    setTimerActive(true);
  }

  const isValidLang = VALID_LANGS.includes(lang as ExamLang);
  if (!isValidLang) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12 text-center text-zinc-500 text-xl">
        Invalid language.
      </div>
    );
  }

  const content = getExamContent(lang as ExamLang);
  const title = `${content.ui.part1} ${content.ui.writtenExam}`;

  if (state === 'instructions') {
    return (
      <div ref={containerRef} className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
              title="全屏"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          <h1 className="font-dm-serif text-5xl text-ada-navy text-center mb-10">
            {title}
          </h1>

          <ol className="space-y-5 text-xl text-zinc-600 mb-10">
            {content.writtenRules.map((rule, index) => (
              <li key={index} className="flex gap-4">
                <span className="shrink-0 font-semibold text-ada-navy text-xl">
                  {index + 1}.
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>

          <button
            onClick={handleBeginExam}
            className="w-full py-5 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-2xl hover:bg-ada-purple/90 transition"
          >
            {content.ui.beginExam}
          </button>
        </div>
      </div>
    );
  }

  // Active state — audio plays first, then countdown
  return (
    <div
      ref={containerRef}
      className="bg-white min-h-screen flex flex-col items-center justify-center relative"
    >
      {/* Top controls */}
      <div className="absolute top-6 right-8 flex items-center gap-2 z-10">
        {timerActive && (
          <button
            onClick={() => setTimerPaused(!timerPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-outfit text-sm font-semibold transition ${
              timerPaused
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {timerPaused ? (
              <>
                <Play className="w-4 h-4" />
                继续
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                暂停
              </>
            )}
          </button>
        )}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Title */}
      <h1 className="font-dm-serif text-4xl text-ada-navy mb-12">
        {title}
      </h1>

      {/* Audio player — only shown before timer starts */}
      {!timerActive && (
        <div className="w-full max-w-md mb-10">
          <AudioPlayer
            src="/audio/exam/written-instructions.mp3"
            autoPlay
            onEnded={handleAudioEnded}
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={startTimerNow}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-outfit text-base font-semibold hover:bg-green-600 transition"
            >
              <Timer className="w-5 h-5" />
              跳过音频，开始计时
            </button>
          </div>
        </div>
      )}

      {/* Giant clock — only after audio finishes (or skip) */}
      {timerActive && (
        <div className="scale-[2] origin-center">
          <CountdownTimer
            size="lg"
            durationSeconds={3600}
            warningAtSeconds={900}
            startedAt={startedAt}
            paused={timerPaused}
          />
        </div>
      )}

      {timerActive && (
        <p className="mt-20 text-lg text-zinc-400 font-outfit">
          {content.ui.timeRemaining}
        </p>
      )}
    </div>
  );
}
