'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { CountdownTimer, formatTime } from '@/components/exam/countdown-timer';
import { AudioPlayer } from '@/components/exam/audio-player';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Timer,
  List,
  X,
} from 'lucide-react';

export default function PracticalExamPage() {
  const { lang } = useParams<{ lang: string }>();
  const content = useMemo(
    () => getExamContent((lang || 'zh-cn') as ExamLang),
    [lang]
  );

  const [phase, setPhase] = useState<'instructions' | 'active' | 'complete'>(
    'instructions'
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Flatten all modules into linear steps with module index info
  const flatSteps = useMemo(() => {
    let stepIndex = 0;
    return content.modules.flatMap((mod, modIndex) =>
      mod.steps.map((step) => ({
        ...step,
        moduleTitle: mod.title,
        moduleEnglishTitle: mod.englishTitle,
        moduleIndex: modIndex,
        flatIndex: stepIndex++,
      }))
    );
  }, [content.modules]);

  // Build module index → first flat step index mapping
  const moduleStartIndices = useMemo(() => {
    const map: number[] = [];
    let idx = 0;
    for (const mod of content.modules) {
      map.push(idx);
      idx += mod.steps.length;
    }
    return map;
  }, [content.modules]);

  function goToStep(index: number) {
    setCurrentStep(index);
    setTimerKey((prev) => prev + 1);
    setTimerActive(false);
    setTimerPaused(false);
  }

  function advanceStep() {
    if (currentStep >= flatSteps.length - 1) {
      setPhase('complete');
    } else {
      goToStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }

  function resetTimer() {
    setTimerKey((prev) => prev + 1);
    setTimerActive(true);
    setTimerPaused(false);
  }

  function startTimer() {
    setTimerActive(true);
    setTimerPaused(false);
  }

  const handleTimeUp = useCallback(() => {
    // Don't auto-advance — let admin decide
  }, []);

  function handleAudioEnded() {
    setTimerActive(true);
    setTimerPaused(false);
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
          考试共{content.modules.length}项考核模块。每项考核模块有具体的考核内容和时间限制。请按照提示依次完成。
        </p>

        {/* Module overview */}
        <div className="mt-8 grid gap-3">
          {content.modules.map((mod, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 px-5 py-3"
            >
              <span className="text-lg font-outfit font-semibold text-ada-purple w-8">
                {i + 1}
              </span>
              <span className="text-lg text-zinc-700">{mod.title}</span>
              <span className="text-sm text-zinc-400 ml-auto">
                {mod.englishTitle}
              </span>
              <span className="text-sm text-zinc-400">
                {mod.steps.length > 1 ? `${mod.steps.length} 步` : '1 步'}
              </span>
            </div>
          ))}
        </div>

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
      <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h1 className="font-dm-serif text-5xl text-ada-navy text-center">
          考试结束 / {content.ui.examComplete}
        </h1>
        <button
          onClick={() => {
            goToStep(0);
            setPhase('active');
          }}
          className="px-8 py-3 rounded-xl border-2 border-ada-purple text-ada-purple font-outfit font-semibold text-lg hover:bg-ada-purple hover:text-white transition"
        >
          重新开始
        </button>
      </div>
    );
  }

  // --- Active phase ---
  const step = flatSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-8 py-6 relative">
      {/* ── Top control bar ── */}
      <div className="flex items-center justify-between mb-6">
        {/* Progress */}
        <p className="text-lg text-zinc-400 font-outfit">
          {content.ui.step} {currentStep + 1} {content.ui.of} {flatSteps.length}
        </p>

        {/* Control buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNav(!showNav)}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
            title="模块导航"
          >
            {showNav ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Module navigator sidebar ── */}
      {showNav && (
        <div className="absolute top-16 right-8 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 max-h-[70vh] overflow-y-auto">
          <p className="text-sm font-outfit font-semibold text-zinc-400 mb-3">
            模块导航
          </p>
          {content.modules.map((mod, modIndex) => {
            const startIdx = moduleStartIndices[modIndex];
            const isCurrentModule = step.moduleIndex === modIndex;
            return (
              <div key={modIndex} className="mb-2">
                <button
                  onClick={() => {
                    goToStep(startIdx);
                    setShowNav(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-outfit transition ${
                    isCurrentModule
                      ? 'bg-ada-purple/10 text-ada-purple font-semibold'
                      : 'hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <span className="font-semibold mr-2">{modIndex + 1}.</span>
                  {mod.title}
                  <span className="text-zinc-400 ml-2 text-xs">
                    ({mod.steps.length} 步)
                  </span>
                </button>
                {/* Show sub-steps for current module */}
                {isCurrentModule && mod.steps.length > 1 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {mod.steps.map((s, sIdx) => {
                      const flatIdx = startIdx + sIdx;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => {
                            goToStep(flatIdx);
                            setShowNav(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs font-outfit transition ${
                            currentStep === flatIdx
                              ? 'bg-ada-purple text-white'
                              : 'hover:bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {s.subtitle || `步骤 ${sIdx + 1}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Main content ── */}
      {/* Module title */}
      <h1 className="font-dm-serif text-4xl text-ada-navy">{step.moduleTitle}</h1>
      <p className="text-lg text-zinc-400 font-outfit mt-2">
        {step.moduleEnglishTitle}
      </p>

      {/* Subtitle */}
      {step.subtitle && (
        <p className="text-3xl font-outfit font-semibold text-ada-purple mt-6">
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

      {/* Audio */}
      <div className="mt-8">
        <AudioPlayer src={step.audio} autoPlay onEnded={handleAudioEnded} />
      </div>

      {/* ── Timer section ── */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {timerActive ? (
          <CountdownTimer
            key={timerKey}
            durationSeconds={step.durationSeconds}
            onTimeUp={handleTimeUp}
            size="sm"
            warningAtSeconds={10}
            paused={timerPaused}
          />
        ) : (
          <span className="text-5xl font-outfit font-semibold text-zinc-300 tabular-nums">
            {formatTime(step.durationSeconds)}
          </span>
        )}

        {/* Timer controls */}
        <div className="flex items-center gap-3">
          {!timerActive && (
            <button
              onClick={startTimer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-outfit text-sm font-semibold hover:bg-green-600 transition"
            >
              <Timer className="w-4 h-4" />
              开始计时
            </button>
          )}
          {timerActive && (
            <>
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
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-200 text-zinc-600 font-outfit text-sm font-semibold hover:bg-zinc-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Navigation buttons ── */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-zinc-200 text-zinc-600 font-outfit font-semibold text-xl hover:bg-zinc-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
          上一步
        </button>
        <button
          onClick={advanceStep}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-xl hover:bg-ada-purple/90 transition"
        >
          {currentStep >= flatSteps.length - 1 ? '完成' : '下一步'}
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
