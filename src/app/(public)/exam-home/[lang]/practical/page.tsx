'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  Maximize,
  Minimize,
  Check,
  XCircle,
} from 'lucide-react';

type ModuleScore = {
  passed: boolean | null; // null = not scored yet
  notes: string;
};

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Per-module scores
  const [scores, setScores] = useState<Record<number, ModuleScore>>({});

  // Flatten all modules into linear steps
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

  const moduleStartIndices = useMemo(() => {
    const map: number[] = [];
    let idx = 0;
    for (const mod of content.modules) {
      map.push(idx);
      idx += mod.steps.length;
    }
    return map;
  }, [content.modules]);

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

  // Navigation
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

  const handleTimeUp = useCallback(() => {}, []);

  function handleAudioEnded() {
    setTimerActive(true);
    setTimerPaused(false);
  }

  // Scoring
  function scoreModule(moduleIndex: number, passed: boolean) {
    setScores((prev) => ({
      ...prev,
      [moduleIndex]: { ...prev[moduleIndex], passed, notes: prev[moduleIndex]?.notes || '' },
    }));
  }

  function setModuleNotes(moduleIndex: number, notes: string) {
    setScores((prev) => ({
      ...prev,
      [moduleIndex]: { ...prev[moduleIndex], passed: prev[moduleIndex]?.passed ?? null, notes },
    }));
  }

  // --- Instructions phase ---
  if (phase === 'instructions') {
    return (
      <div ref={containerRef} className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
              title="全屏"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          <h1 className="font-dm-serif text-5xl text-ada-navy text-center">
            {content.ui.part2} {content.ui.practicalExam}
          </h1>
          <p className="text-xl text-zinc-400 font-outfit mt-4 text-center">
            实操考试流程说明
          </p>
          <p className="text-xl text-zinc-700 leading-relaxed mt-8 text-center">
            考试共{content.modules.length}项考核模块。每项考核模块有具体的考核内容和时间限制。请按照提示依次完成。
          </p>

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
      </div>
    );
  }

  // --- Complete phase ---
  if (phase === 'complete') {
    const scoredCount = Object.values(scores).filter((s) => s.passed !== null).length;
    const passedCount = Object.values(scores).filter((s) => s.passed === true).length;

    return (
      <div ref={containerRef} className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <h1 className="font-dm-serif text-5xl text-ada-navy text-center mb-8">
            考试结束 / {content.ui.examComplete}
          </h1>

          {/* Score summary */}
          {scoredCount > 0 && (
            <div className="bg-zinc-50 rounded-2xl p-6 mb-8">
              <h2 className="font-outfit font-semibold text-xl text-ada-navy mb-4">
                评分汇总
              </h2>
              <div className="text-lg text-zinc-600 mb-4">
                已评分 {scoredCount} / {content.modules.length} 个模块，
                通过 {passedCount} 个
              </div>
              <div className="grid gap-2">
                {content.modules.map((mod, i) => {
                  const score = scores[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-zinc-200"
                    >
                      <span className="font-outfit font-semibold text-ada-purple w-6">
                        {i + 1}
                      </span>
                      <span className="text-zinc-700 flex-1">{mod.title}</span>
                      {score?.passed === true && (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" /> 通过
                        </span>
                      )}
                      {score?.passed === false && (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> 未通过
                        </span>
                      )}
                      {score?.passed === null || score?.passed === undefined ? (
                        <span className="text-zinc-400">未评分</span>
                      ) : null}
                      {score?.notes && (
                        <span className="text-xs text-zinc-400 max-w-[200px] truncate">
                          {score.notes}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
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
        </div>
      </div>
    );
  }

  // --- Active phase ---
  const step = flatSteps[currentStep];

  return (
    <div ref={containerRef} className="bg-white min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-8 py-6 flex flex-col">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <p className="text-lg text-zinc-400 font-outfit">
            {content.ui.step} {currentStep + 1} {content.ui.of} {flatSteps.length}
          </p>

          <div className="flex items-center gap-2">
            {/* Scoring toggle */}
            <button
              onClick={() => setShowScoring(!showScoring)}
              className={`px-3 py-1.5 rounded-lg text-sm font-outfit font-semibold transition ${
                showScoring
                  ? 'bg-ada-purple text-white'
                  : 'hover:bg-zinc-100 text-zinc-500'
              }`}
              title="评分面板"
            >
              评分
            </button>
            {/* Nav toggle */}
            <button
              onClick={() => { setShowNav(!showNav); setShowScoring(false); }}
              className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
              title="模块导航"
            >
              {showNav ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
            {/* Fullscreen */}
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
        </div>

        {/* ── Module navigator ── */}
        {showNav && (
          <div className="absolute top-20 right-8 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 max-h-[70vh] overflow-y-auto">
            <p className="text-sm font-outfit font-semibold text-zinc-400 mb-3">
              模块导航
            </p>
            {content.modules.map((mod, modIndex) => {
              const startIdx = moduleStartIndices[modIndex];
              const isCurrentModule = step.moduleIndex === modIndex;
              const modScore = scores[modIndex];
              return (
                <div key={modIndex} className="mb-2">
                  <button
                    onClick={() => {
                      goToStep(startIdx);
                      setShowNav(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-outfit transition flex items-center ${
                      isCurrentModule
                        ? 'bg-ada-purple/10 text-ada-purple font-semibold'
                        : 'hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <span className="font-semibold mr-2">{modIndex + 1}.</span>
                    <span className="flex-1">{mod.title}</span>
                    {modScore?.passed === true && (
                      <Check className="w-4 h-4 text-green-500 ml-2" />
                    )}
                    {modScore?.passed === false && (
                      <XCircle className="w-4 h-4 text-red-500 ml-2" />
                    )}
                  </button>
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

        {/* ── Scoring panel ── */}
        {showScoring && (
          <div className="mb-6 bg-zinc-50 rounded-2xl p-5 shrink-0">
            <p className="text-sm font-outfit font-semibold text-zinc-400 mb-3">
              模块 {step.moduleIndex + 1} 评分：{content.modules[step.moduleIndex].title}
            </p>
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => scoreModule(step.moduleIndex, true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-outfit text-sm font-semibold transition ${
                  scores[step.moduleIndex]?.passed === true
                    ? 'bg-green-500 text-white'
                    : 'bg-white border border-green-300 text-green-600 hover:bg-green-50'
                }`}
              >
                <Check className="w-4 h-4" />
                通过
              </button>
              <button
                onClick={() => scoreModule(step.moduleIndex, false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-outfit text-sm font-semibold transition ${
                  scores[step.moduleIndex]?.passed === false
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                未通过
              </button>
            </div>
            <input
              type="text"
              placeholder="备注（可选）"
              value={scores[step.moduleIndex]?.notes || ''}
              onChange={(e) => setModuleNotes(step.moduleIndex, e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-outfit focus:outline-none focus:border-ada-purple"
            />
          </div>
        )}

        {/* ── Main content (flex-1 to fill space) ── */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Module title */}
          <h1 className="font-dm-serif text-4xl text-ada-navy">{step.moduleTitle}</h1>
          <p className="text-lg text-zinc-400 font-outfit mt-2">
            {step.moduleEnglishTitle}
          </p>

          {step.subtitle && (
            <p className="text-3xl font-outfit font-semibold text-ada-purple mt-6">
              【{step.subtitle}】
            </p>
          )}

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

          <p className="text-lg font-semibold text-zinc-500 mt-6">
            {content.ui.requirementLabel}
          </p>
          <p className="text-xl text-zinc-700 leading-relaxed mt-2">
            {step.requirement}
          </p>

          <p className="text-lg text-zinc-400 mt-4">{step.durationLabel}</p>

          <div className="mt-6">
            <AudioPlayer src={step.audio} autoPlay onEnded={handleAudioEnded} />
          </div>

          {/* Timer */}
          <div className="mt-6 flex flex-col items-center gap-4">
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
        </div>

        {/* ── Navigation ── */}
        <div className="mt-8 flex gap-4 shrink-0">
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
    </div>
  );
}
