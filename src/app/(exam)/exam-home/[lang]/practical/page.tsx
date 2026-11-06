'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { CountdownTimer, TIMER_TEXT, formatTime } from '@/components/exam/countdown-timer';
import { AudioPlayer } from '@/components/exam/audio-player';
import { BiText } from '@/components/exam/bi-text';
import { useExamCopy } from '@/components/exam/exam-copy';
import { ExamBand, ExamH2, examButtonClass } from '@/components/exam/exam-ui';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Maximize,
  Minimize,
  Check,
  XCircle,
} from 'lucide-react';

type ModuleScore = {
  passed: boolean | null; // null = not scored yet
  notes: string;
};

/** "情景描述：" → "情景描述" (the row label already says what follows). */
function rowLabel(label: string) {
  return label.replace(/[:：]\s*$/, '');
}

/** "考核时间：2 分钟。" → "2 分钟。" (shown in the Time row). */
function durationValue(label: string) {
  return label.replace(/^[^:：]*[:：]\s*/, '');
}

export default function PracticalExamPage() {
  const { lang } = useParams<{ lang: string }>();
  const content = useMemo(
    () => getExamContent((lang || 'zh-cn') as ExamLang),
    [lang]
  );
  const enContent = useMemo(() => getExamContent('en'), []);
  const { lang: copyLang, t, Bi } = useExamCopy();

  const [phase, setPhase] = useState<'instructions' | 'active' | 'complete'>(
    'instructions'
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
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

  const bandTitle = (
    <BiText
      lang={copyLang}
      main={`${content.ui.part2} · ${content.ui.practicalExam}`}
      alt={`${enContent.ui.part2} · ${enContent.ui.practicalExam}`}
      altClassName="text-[22px] leading-7 font-light text-ada2-body"
    />
  );

  const fullscreenButton = (
    <button type="button" onClick={toggleFullscreen} className={examButtonClass('secondary')}>
      {isFullscreen ? <Minimize className="w-5 h-5" aria-hidden="true" /> : <Maximize className="w-5 h-5" aria-hidden="true" />}
      <Bi k={isFullscreen ? 'controls.exitFullscreen' : 'controls.fullscreen'} />
    </button>
  );

  /** A module's score as a short, coloured result (text + icon, not colour alone). */
  function scoreResult(score: ModuleScore | undefined, size: 'md' | 'sm' = 'md') {
    const text = size === 'md' ? 'text-[17px] leading-6' : 'text-[15px] leading-5';
    if (score?.passed === true) {
      return (
        <span className={cn('inline-flex items-center gap-1.5 font-semibold text-ada2-good-text whitespace-nowrap', text)}>
          <Check className="w-4 h-4" aria-hidden="true" />
          <Bi k="practical.pass" stack={size === 'sm'} className="font-semibold" />
        </span>
      );
    }
    if (score?.passed === false) {
      return (
        <span className={cn('inline-flex items-center gap-1.5 font-semibold text-ada2-suspended whitespace-nowrap', text)}>
          <XCircle className="w-4 h-4" aria-hidden="true" />
          <Bi k="practical.fail" stack={size === 'sm'} className="font-semibold" />
        </span>
      );
    }
    return null;
  }

  // --- Instructions phase ---
  if (phase === 'instructions') {
    return (
      <div ref={containerRef} className="flex-1 flex flex-col bg-white [&:fullscreen]:overflow-auto">
        <ExamBand title={bandTitle} right={fullscreenButton} />

        <div className="ada2-wrap pt-10 pb-16">
          <div className="max-w-[1000px] flex flex-col gap-10">
            <section aria-labelledby="practical-intro" className="flex flex-col gap-4">
              <ExamH2 id="practical-intro">
                <Bi k="practical.instructionsTitle" altClassName="text-[20px] leading-7 font-light text-ada2-body" />
              </ExamH2>
              <p className="m-0 max-w-[820px] text-[22px] leading-8 text-ada2-ink [text-wrap:pretty]">
                <Bi
                  k="practical.intro"
                  values={{ count: content.modules.length }}
                  stack
                  className="gap-1"
                  altClassName="text-[17px] leading-6 text-ada2-body"
                />
              </p>
            </section>

            <ol className="m-0 p-0 list-none border-t-2 border-ada2-ink">
              {content.modules.map((mod, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-3.5 border-b border-ada2-hairline">
                  <span className="flex-none w-8 text-[20px] leading-7 font-semibold text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
                    {i + 1}
                  </span>
                  <span className="flex-[1_1_320px] min-w-0 flex flex-col">
                    <span lang="zh-Hans" className="text-[20px] leading-7 text-ada2-ink">{mod.title}</span>
                    <span lang="en" className="text-[15px] leading-[22px] text-ada2-muted">{mod.englishTitle}</span>
                  </span>
                  <span className="flex-none text-[16px] leading-[22px] text-ada2-body [font-variant-numeric:tabular-nums_lining-nums]">
                    <Bi k="practical.steps" values={{ count: mod.steps.length }} altClassName="text-ada2-muted" />
                  </span>
                </li>
              ))}
            </ol>

            <AudioPlayer src="/audio/exam/practical-instructions.mp3" />

            <button
              type="button"
              onClick={() => setPhase('active')}
              className={examButtonClass('primary', { size: 'lg', className: 'w-full sm:w-auto sm:min-w-[360px] self-start' })}
            >
              <BiText lang={copyLang} main={content.ui.beginExam} alt={enContent.ui.beginExam} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Complete phase ---
  if (phase === 'complete') {
    const scoredCount = Object.values(scores).filter((s) => s.passed !== null).length;
    const passedCount = Object.values(scores).filter((s) => s.passed === true).length;

    return (
      <div ref={containerRef} className="flex-1 flex flex-col bg-white [&:fullscreen]:overflow-auto">
        <ExamBand
          title={
            <BiText
              lang={copyLang}
              main={content.ui.examComplete}
              alt={enContent.ui.examComplete}
              altClassName="text-[22px] leading-7 font-light text-ada2-body"
            />
          }
        />

        <div className="ada2-wrap pt-10 pb-16">
          <div className="max-w-[1000px] flex flex-col gap-8">
            {/* Score summary */}
            {scoredCount > 0 && (
              <section aria-labelledby="summary-title" className="flex flex-col gap-4">
                <ExamH2 id="summary-title">
                  <Bi k="practical.summaryTitle" altClassName="text-[20px] leading-7 font-light text-ada2-body" />
                </ExamH2>
                <p className="m-0 text-[20px] leading-7 text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
                  <Bi
                    k="practical.summaryCount"
                    values={{ scored: scoredCount, total: content.modules.length, passed: passedCount }}
                    stack
                    altClassName="text-[16px] leading-6 text-ada2-body"
                  />
                </p>
                <ol className="m-0 p-0 list-none border-t-2 border-ada2-ink">
                  {content.modules.map((mod, i) => {
                    const score = scores[i];
                    return (
                      <li key={i} className="flex flex-wrap items-center gap-x-5 gap-y-1 py-3 border-b border-ada2-hairline">
                        <span className="flex-none w-7 text-[18px] leading-6 font-semibold text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
                          {i + 1}
                        </span>
                        <span lang="zh-Hans" className="flex-[1_1_200px] min-w-0 text-[18px] leading-6 text-ada2-ink">
                          {mod.title}
                        </span>
                        {score?.passed === null || score?.passed === undefined ? (
                          <span className="text-[16px] leading-[22px] text-ada2-muted">
                            <Bi k="practical.notScored" />
                          </span>
                        ) : (
                          scoreResult(score)
                        )}
                        {score?.notes && (
                          <span className="basis-full pl-12 text-[15px] leading-[22px] text-ada2-body [overflow-wrap:anywhere]">
                            {score.notes}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            <div>
              <button
                type="button"
                onClick={() => {
                  goToStep(0);
                  setPhase('active');
                }}
                className={examButtonClass('secondary')}
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                <Bi k="practical.restart" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Active phase ---
  const step = flatSteps[currentStep];
  const currentModule = content.modules[step.moduleIndex];
  const isLast = currentStep >= flatSteps.length - 1;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-white [&:fullscreen]:overflow-auto">
      <ExamBand
        title={bandTitle}
        sub={
          <span className="[font-variant-numeric:tabular-nums_lining-nums]">
            <BiText
              lang={copyLang}
              main={`${content.ui.step} ${currentStep + 1} ${content.ui.of} ${flatSteps.length}`}
              alt={`${enContent.ui.step} ${currentStep + 1} ${enContent.ui.of} ${flatSteps.length}`}
              altClassName="text-ada2-muted"
            />
          </span>
        }
        right={
          <>
            {/* Scoring toggle */}
            <button
              type="button"
              aria-pressed={showScoring}
              aria-controls={showScoring ? 'scoring-panel' : undefined}
              onClick={() => setShowScoring(!showScoring)}
              className={examButtonClass('secondary', { pressed: showScoring })}
            >
              <Bi k="practical.scoring" />
            </button>
            {fullscreenButton}
          </>
        }
      />

      <div className="ada2-wrap pt-8 pb-12 flex flex-wrap items-start gap-x-14 gap-y-10">
        {/* ── Main column ── */}
        <div className="flex-[999_1_600px] min-w-0 flex flex-col gap-6">
          {/* ── Scoring panel ── */}
          {showScoring && (
            <section
              id="scoring-panel"
              aria-labelledby="scoring-title"
              className="flex flex-col gap-4 bg-ada2-band border-t-2 border-ada2-ink px-6 pt-5 pb-6"
            >
              <h2 id="scoring-title" className="m-0 text-[18px] leading-6 font-semibold text-ada2-ink">
                <BiText
                  lang={copyLang}
                  main={t('practical.scoreFor', { number: step.moduleIndex + 1, title: currentModule.title })}
                  alt={currentModule.englishTitle}
                  altClassName="font-normal text-ada2-body"
                />
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  aria-pressed={scores[step.moduleIndex]?.passed === true}
                  onClick={() => scoreModule(step.moduleIndex, true)}
                  className={examButtonClass('pass', { pressed: scores[step.moduleIndex]?.passed === true })}
                >
                  <Check className="w-5 h-5" aria-hidden="true" />
                  <Bi k="practical.pass" />
                </button>
                <button
                  type="button"
                  aria-pressed={scores[step.moduleIndex]?.passed === false}
                  onClick={() => scoreModule(step.moduleIndex, false)}
                  className={examButtonClass('fail', { pressed: scores[step.moduleIndex]?.passed === false })}
                >
                  <XCircle className="w-5 h-5" aria-hidden="true" />
                  <Bi k="practical.fail" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="module-notes" className="text-[16px] leading-[22px] font-semibold text-ada2-ink">
                  <Bi k="practical.notes" altClassName="text-ada2-body" />
                </label>
                <input
                  id="module-notes"
                  type="text"
                  value={scores[step.moduleIndex]?.notes || ''}
                  onChange={(e) => setModuleNotes(step.moduleIndex, e.target.value)}
                  className="w-full min-w-0 box-border h-[56px] px-4 bg-white border-[1.5px] border-solid border-ada2-muted rounded-[4px] text-[18px] text-ada2-ink appearance-none"
                />
              </div>
            </section>
          )}

          {/* ── Task heading ── */}
          <div className="flex flex-col gap-2 pb-6 border-b-2 border-ada2-ink">
            <h2 lang="zh-Hans" className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
              {step.moduleTitle}
            </h2>
            <p lang="en" className="m-0 text-[22px] leading-[31px] font-light text-ada2-body">
              {step.moduleEnglishTitle}
            </p>
            {step.subtitle && (
              <p lang="zh-Hans" className="m-0 mt-2 text-[30px] leading-[38px] font-semibold text-ada2-ink">
                【{step.subtitle}】
              </p>
            )}
          </div>

          {/* ── Audio + task timer ── */}
          <div className="flex flex-wrap items-stretch gap-6">
            <AudioPlayer
              src={step.audio}
              autoPlay
              onEnded={handleAudioEnded}
              note={<Bi k="practical.timerNote" altClassName="text-ada2-muted" />}
              className="flex-[999_1_400px] min-w-0"
            />
            <div className="flex-[1_1_300px] min-w-0 box-border flex flex-col gap-3 border border-ada2-hairline px-6 pt-5 pb-6">
              <p className="m-0 text-[16px] leading-[22px] text-ada2-body">
                <Bi k="practical.taskTimer" className="font-semibold text-ada2-ink" />
              </p>
              {timerActive ? (
                <CountdownTimer
                  key={timerKey}
                  durationSeconds={step.durationSeconds}
                  onTimeUp={handleTimeUp}
                  size="sm"
                  warningAtSeconds={10}
                  paused={timerPaused}
                  timeUpLabel={<BiText lang={copyLang} main={content.ui.timeUp} alt={enContent.ui.timeUp} stack />}
                />
              ) : (
                <>
                  <span className={cn('block text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]', TIMER_TEXT.sm)}>
                    {formatTime(step.durationSeconds)}
                  </span>
                  <span className="text-[16px] leading-[22px] text-ada2-ink">
                    <Bi k="practical.notStarted" className="font-semibold" />
                  </span>
                </>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!timerActive && (
                  <button type="button" onClick={startTimer} className={examButtonClass('primary')}>
                    <Timer className="w-5 h-5" aria-hidden="true" />
                    <Bi k="practical.startTimer" />
                  </button>
                )}
                {timerActive && (
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
                    <button type="button" onClick={resetTimer} className={examButtonClass('secondary')}>
                      <RotateCcw className="w-5 h-5" aria-hidden="true" />
                      <Bi k="practical.reset" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Transcript ── */}
          <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
            {step.scenario && (
              <div className="flex flex-wrap gap-x-8 gap-y-1 py-4 border-b border-ada2-hairline">
                <dt className="flex-[0_0_160px] text-[18px] leading-6 font-semibold text-ada2-ink">
                  <BiText lang={copyLang} main={rowLabel(content.ui.scenarioLabel)} alt={rowLabel(enContent.ui.scenarioLabel)} stack altClassName="text-[16px] text-ada2-body" />
                </dt>
                <dd lang="zh-Hans" className="flex-[1_1_320px] min-w-0 m-0 text-[24px] leading-[36px] text-ada2-ink [text-wrap:pretty]">
                  {step.scenario}
                </dd>
              </div>
            )}
            <div className="flex flex-wrap gap-x-8 gap-y-1 py-4 border-b border-ada2-hairline">
              <dt className="flex-[0_0_160px] text-[18px] leading-6 font-semibold text-ada2-ink">
                <BiText lang={copyLang} main={rowLabel(content.ui.requirementLabel)} alt={rowLabel(enContent.ui.requirementLabel)} stack altClassName="text-[16px] text-ada2-body" />
              </dt>
              <dd lang="zh-Hans" className="flex-[1_1_320px] min-w-0 m-0 text-[24px] leading-[36px] text-ada2-ink [text-wrap:pretty]">
                {step.requirement}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-1 py-4 border-b border-ada2-hairline">
              <dt className="flex-[0_0_160px] text-[18px] leading-6 font-semibold text-ada2-ink">
                <BiText lang={copyLang} main={rowLabel(content.ui.durationLabel)} alt={rowLabel(enContent.ui.durationLabel)} stack altClassName="text-[16px] text-ada2-body" />
              </dt>
              <dd lang="zh-Hans" className="flex-[1_1_320px] min-w-0 m-0 text-[24px] leading-[36px] text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
                {durationValue(step.durationLabel)}
              </dd>
            </div>
          </dl>
        </div>

        {/* ── Item list (was the module navigator) ── */}
        <nav aria-labelledby="items-title" className="flex-[1_1_300px] max-w-[400px] min-w-0 flex flex-col gap-3">
          <h2 id="items-title" className="m-0 text-[22px] leading-7 font-semibold text-ada2-ink">
            <Bi k="practical.itemsTitle" altClassName="text-[18px] text-ada2-body" />
          </h2>
          <ol className="m-0 p-0 list-none border-t-2 border-ada2-ink">
            {content.modules.map((mod, modIndex) => {
              const startIdx = moduleStartIndices[modIndex];
              const isCurrentModule = step.moduleIndex === modIndex;
              const modScore = scores[modIndex];
              return (
                <li key={modIndex} className="border-b border-ada2-hairline">
                  <button
                    type="button"
                    aria-current={isCurrentModule ? 'step' : undefined}
                    onClick={() => goToStep(startIdx)}
                    className={cn(
                      'w-full flex items-center gap-4 min-h-[64px] box-border pr-3 py-2.5 text-left bg-transparent border-0 border-l-4 border-solid cursor-pointer text-ada2-ink',
                      isCurrentModule ? 'border-l-ada2-ink bg-ada2-band pl-3' : 'border-l-transparent pl-3 hover:bg-ada2-band'
                    )}
                  >
                    <span className={cn('flex-none w-6 text-[17px] leading-6 [font-variant-numeric:tabular-nums_lining-nums]', isCurrentModule ? 'font-bold' : 'font-normal text-ada2-body')}>
                      {modIndex + 1}
                    </span>
                    <span className="flex-1 min-w-0 flex flex-col">
                      <span lang="zh-Hans" className={cn('text-[19px] leading-[26px]', isCurrentModule && 'font-semibold')}>
                        {mod.title}
                      </span>
                      <span lang="en" className="text-[14px] leading-5 text-ada2-muted">{mod.englishTitle}</span>
                    </span>
                    {isCurrentModule && modScore?.passed == null ? (
                      <span className="flex-none text-[15px] leading-5 font-semibold text-ada2-ink">
                        <Bi k="practical.now" stack className="items-end text-right" />
                      </span>
                    ) : (
                      <span className="flex-none">
                        {scoreResult(modScore, 'sm')}
                      </span>
                    )}
                  </button>
                  {isCurrentModule && mod.steps.length > 1 && (
                    <ol className="m-0 pl-10 pr-2 pb-2 pt-1 list-none flex flex-col gap-1 bg-ada2-band border-l-4 border-solid border-ada2-ink">
                      {mod.steps.map((s, sIdx) => {
                        const flatIdx = startIdx + sIdx;
                        const isCurrentStep = currentStep === flatIdx;
                        return (
                          <li key={sIdx}>
                            <button
                              type="button"
                              aria-current={isCurrentStep ? 'step' : undefined}
                              onClick={() => goToStep(flatIdx)}
                              className={cn(
                                'w-full min-h-[48px] box-border px-3 text-left rounded-full border-[1.5px] border-solid cursor-pointer text-[16px] leading-[22px]',
                                isCurrentStep
                                  ? 'bg-ada2-ink border-ada2-ink text-white font-semibold'
                                  : 'bg-white border-ada2-hairline text-ada2-ink hover:border-ada2-ink'
                              )}
                            >
                              {s.subtitle ? (
                                <span lang="zh-Hans">{s.subtitle}</span>
                              ) : (
                                t('practical.stepFallback', { number: sIdx + 1 })
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* ── Navigation ── */}
      <div className="mt-auto bg-ada2-band border-t-2 border-ada2-ink">
        <div className="ada2-wrap py-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="m-0 text-[20px] leading-7 font-semibold text-ada2-ink">
            <Bi k="practical.proctorControls" altClassName="text-[17px] text-ada2-body" />
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={examButtonClass('secondary', { className: 'min-w-[180px]' })}
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              <Bi k="controls.previous" />
            </button>
            <button
              type="button"
              onClick={advanceStep}
              className={examButtonClass('primary', { className: 'min-w-[180px]' })}
            >
              <Bi k={isLast ? 'controls.finish' : 'controls.next'} />
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
