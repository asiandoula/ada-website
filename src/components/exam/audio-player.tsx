"use client";

/**
 * The audio instructions panel (canvas ExamPractical): a grey panel with the
 * title, a 56px Play/Pause pill, the progress bar and the time read-out.
 * Behaviour is unchanged: same <audio> element, autoplay on src change, onEnded.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useExamCopy } from "./exam-copy";

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  /** A line under the controls, e.g. "The task timer starts when the audio ends." */
  note?: ReactNode;
  className?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M7 4.5v15l12.5-7.5z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" />
    </svg>
  );
}

function SpeakerGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 010 6" />
    </svg>
  );
}

export function AudioPlayer({ src, autoPlay = false, onEnded, note, className }: AudioPlayerProps) {
  const { Bi, t } = useExamCopy();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [src, autoPlay]);

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }

  function handleEnded() {
    setIsPlaying(false);
    onEnded?.();
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("box-border flex flex-col gap-4 bg-ada2-band px-6 pt-5 pb-6", className)}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-[17px] leading-6 text-ada2-ink">
        <Bi k="audio.title" className="font-semibold" altClassName="text-ada2-body" />
        {isPlaying ? (
          <span className="inline-flex items-center gap-1.5 text-[15px] leading-5 text-ada2-body">
            <SpeakerGlyph />
            <Bi k="audio.playing" className="font-semibold text-ada2-ink" />
          </span>
        ) : null}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={isPlaying}
          className="inline-flex items-center justify-center gap-2.5 min-h-[56px] box-border px-7 rounded-full border-[1.5px] border-solid border-ada2-ink bg-white text-ada2-ink text-[18px] leading-6 font-semibold cursor-pointer hover:bg-ada2-band-rule transition-colors"
        >
          {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
          <Bi k={isPlaying ? "audio.pause" : "audio.play"} />
        </button>

        <div className="flex flex-1 min-w-[200px] items-center gap-4">
          <div
            role="progressbar"
            aria-label={t("audio.progress")}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            className="relative flex-1 h-1.5 bg-ada2-hairline overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 bg-ada2-ink transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[15px] leading-5 text-ada2-body whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {note ? <p className="m-0 text-[15px] leading-[22px] text-ada2-body [text-wrap:pretty]">{note}</p> : null}
    </div>
  );
}
