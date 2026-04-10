'use client';

import { useState, useMemo } from 'react';
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
    }
  }

  function handleTimeUp() {
    setTimeout(() => advanceStep(), 3000);
  }

  // --- Instructions phase ---
  if (phase === 'instructions') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-dm-serif text-3xl text-ada-navy">
          {content.ui.part2} {content.ui.practicalExam}
        </h1>
        <p className="text-sm text-zinc-400 font-outfit mt-2">
          实操考试流程说明
        </p>
        <p className="text-sm text-zinc-700 leading-relaxed mt-4">
          考试共9项考核模块。每项考核模块有具体的考核内容和时间限制。请按照提示依次完成。
        </p>
        <div className="mt-6">
          <AudioPlayer src="/audio/exam/practical-instructions.mp3" />
        </div>
        <button
          onClick={() => setPhase('active')}
          className="w-full mt-8 py-3 rounded-xl bg-ada-purple text-white font-outfit font-semibold hover:bg-ada-purple/90 transition"
        >
          {content.ui.beginExam}
        </button>
      </div>
    );
  }

  // --- Complete phase ---
  if (phase === 'complete') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <h1 className="font-dm-serif text-3xl text-ada-navy text-center">
          考试结束 / {content.ui.examComplete}
        </h1>
      </div>
    );
  }

  // --- Active phase ---
  const step = flatSteps[currentStep];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <p className="text-sm text-zinc-400 font-outfit mb-6">
        {content.ui.step} {currentStep + 1} {content.ui.of} {flatSteps.length}
      </p>

      {/* Module title */}
      <h1 className="font-dm-serif text-2xl text-ada-navy">{step.moduleTitle}</h1>
      <p className="text-sm text-zinc-400 font-outfit mt-1">{step.moduleEnglishTitle}</p>

      {/* Subtitle */}
      {step.subtitle && (
        <p className="text-lg font-outfit font-semibold text-ada-purple mt-4">
          【{step.subtitle}】
        </p>
      )}

      {/* Scenario */}
      {step.scenario && (
        <>
          <p className="text-sm font-semibold text-zinc-500 mt-6">
            {content.ui.scenarioLabel}
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed mt-1">
            {step.scenario}
          </p>
        </>
      )}

      {/* Requirement */}
      <p className="text-sm font-semibold text-zinc-500 mt-4">
        {content.ui.requirementLabel}
      </p>
      <p className="text-sm text-zinc-700 leading-relaxed mt-1">
        {step.requirement}
      </p>

      {/* Duration label */}
      <p className="text-sm text-zinc-400 mt-2">{step.durationLabel}</p>

      {/* Audio */}
      <div className="mt-6">
        <AudioPlayer src={step.audio} autoPlay />
      </div>

      {/* Countdown timer */}
      <div className="mt-6 flex justify-center">
        <CountdownTimer
          key={timerKey}
          durationSeconds={step.durationSeconds}
          onTimeUp={handleTimeUp}
          size="sm"
        />
      </div>

      {/* Next button */}
      <button
        onClick={advanceStep}
        className="w-full mt-8 py-3 rounded-xl bg-ada-purple text-white font-outfit font-semibold hover:bg-ada-purple/90 transition"
      >
        {content.ui.nextStep}
      </button>
    </div>
  );
}
