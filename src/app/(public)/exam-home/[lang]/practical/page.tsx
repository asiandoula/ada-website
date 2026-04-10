'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { CountdownTimer } from '@/components/exam/countdown-timer';
import { AudioPlayer } from '@/components/exam/audio-player';

export default function PracticalExamPage() {
  const { lang } = useParams<{ lang: string }>();
  const content = useMemo(() => getExamContent((lang || 'zh-cn') as ExamLang), [lang]);

  const [phase, setPhase] = useState<'instructions' | 'active' | 'complete'>('instructions');
  const [currentStep, setCurrentStep] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerActive, setTimerActive] = useState(false); // timer waits for audio

  const flatSteps = useMemo(() => {
    return content.modules.flatMap((mod) =>
      mod.steps.map((step) => ({
        ...step,
        moduleTitle: mod.title,
        moduleEnglishTitle: mod.englishTitle,
      }))
    );
  }, [content.modules]);

  function advanceStep() {
    if (currentStep >= flatSteps.length - 1) {
      setPhase('complete');
    } else {
      setCurrentStep((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
      setTimerActive(false); // reset — wait for next audio to finish
    }
  }

  const handleTimeUp = useCallback(() => {
    setTimeout(() => advanceStep(), 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, flatSteps.length]);

  function handleAudioEnded() {
    setTimerActive(true); // audio finished → start countdown
  }

  // --- Instructions phase ---
  if (phase === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="font-dm-serif text-5xl text-ada-navy text-center">
          {content.ui.part2} {content.ui.practicalExam}
        </h1>
        <p className="text-xl text-zinc-400 font-outfit mt-4 text-center">
          实操考试流程说明
        </p>
        <p className="text-xl text-zinc-700 leading-relaxed mt-8 text-center">
          考试共9项考核模块。每项考核模块有具体的考核内容和时间限制。请按照提示依次完成。
        </p>
        <div className="mt-8">
          <AudioPlayer src="/audio/exam/practical-instructions.mp3" />
        </div>
        <button
          onClick={() => setPhase('active')}
          className="w-full mt-10 py-5 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-2xl hover:bg-ada-purple/90 transition"
        >
          {content.ui.beginExam}
        </button>
      </div>
    );
  }

  // --- Complete phase ---
  if (phase === 'complete') {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <h1 className="font-dm-serif text-5xl text-ada-navy text-center">
          考试结束 / {content.ui.examComplete}
        </h1>
      </div>
    );
  }

  // --- Active phase ---
  const step = flatSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* Progress */}
      <p className="text-lg text-zinc-400 font-outfit mb-8">
        {content.ui.step} {currentStep + 1} {content.ui.of} {flatSteps.length}
      </p>

      {/* Module title */}
      <h1 className="font-dm-serif text-4xl text-ada-navy">{step.moduleTitle}</h1>
      <p className="text-lg text-zinc-400 font-outfit mt-2">{step.moduleEnglishTitle}</p>

      {/* Subtitle */}
      {step.subtitle && (
        <p className="text-2xl font-outfit font-semibold text-ada-purple mt-6">
          【{step.subtitle}】
        </p>
      )}

      {/* Scenario */}
      {step.scenario && (
        <>
          <p className="text-lg font-semibold text-zinc-500 mt-8">
            {content.ui.scenarioLabel}
          </p>
          <p className="text-xl text-zinc-700 leading-relaxed mt-2">
            {step.scenario}
          </p>
        </>
      )}

      {/* Requirement */}
      <p className="text-lg font-semibold text-zinc-500 mt-6">
        {content.ui.requirementLabel}
      </p>
      <p className="text-xl text-zinc-700 leading-relaxed mt-2">
        {step.requirement}
      </p>

      {/* Duration label */}
      <p className="text-lg text-zinc-400 mt-4">{step.durationLabel}</p>

      {/* Audio — autoPlay, timer starts when audio ends */}
      <div className="mt-8">
        <AudioPlayer src={step.audio} autoPlay onEnded={handleAudioEnded} />
      </div>

      {/* Countdown timer — only shows after audio finishes */}
      <div className="mt-8 flex justify-center">
        {timerActive ? (
          <CountdownTimer
            key={timerKey}
            durationSeconds={step.durationSeconds}
            onTimeUp={handleTimeUp}
            size="sm"
            warningAtSeconds={10}
          />
        ) : (
          <span className="text-3xl font-outfit font-semibold text-zinc-300 tabular-nums">
            {String(Math.floor(step.durationSeconds / 60)).padStart(2, '0')}:
            {String(step.durationSeconds % 60).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={advanceStep}
        className="w-full mt-10 py-4 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-xl hover:bg-ada-purple/90 transition"
      >
        {content.ui.nextStep}
      </button>
    </div>
  );
}
