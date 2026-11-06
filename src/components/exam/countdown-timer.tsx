'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  durationSeconds: number;
  startedAt?: string;
  onTimeUp?: () => void;
  warningAtSeconds?: number;
  /** lg = the projected room clock (written exam) · sm = the task timer (practical exam). */
  size?: 'sm' | 'lg';
  paused?: boolean;
  playSound?: boolean; // play alert sound when time's up (default: true)
  /** Shown when the time is up, in the exam language (e.g. <BiText main={ui.timeUp} …/>). Default 00:00. */
  timeUpLabel?: ReactNode;
  className?: string;
}

function computeInitialRemaining(durationSeconds: number, startedAt?: string): number {
  if (!startedAt) return durationSeconds;
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  return Math.max(0, durationSeconds - elapsed);
}

export function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return [m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

/** Type sizes shared with the static (not started) task-timer read-out. */
export const TIMER_TEXT: Record<'sm' | 'lg', string> = {
  lg: 'text-[clamp(88px,15vw,200px)] leading-none font-semibold tracking-[-0.02em]',
  sm: 'text-[64px] leading-none font-light',
};

export function CountdownTimer({
  durationSeconds,
  startedAt,
  onTimeUp,
  warningAtSeconds = 900,
  size = 'lg',
  paused = false,
  playSound = true,
  timeUpLabel,
  className,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<number>(() =>
    computeInitialRemaining(durationSeconds, startedAt)
  );
  const [timeUpFired, setTimeUpFired] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-load alert sound
  useEffect(() => {
    if (playSound) {
      audioRef.current = new Audio('/audio/exam/time-up-alert.mp3');
      audioRef.current.preload = 'auto';
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [playSound]);

  useEffect(() => {
    const initial = computeInitialRemaining(durationSeconds, startedAt);
    setRemaining(initial);
    setTimeUpFired(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSeconds, startedAt]);

  useEffect(() => {
    if (paused || remaining <= 0) {
      if (remaining <= 0 && !timeUpFired) {
        setTimeUpFired(true);
        // Play alert sound
        if (playSound && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
        onTimeUp?.();
      }
      return;
    }

    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, timeUpFired, paused]);

  const isTimeUp = remaining <= 0;
  const isWarning = !isTimeUp && remaining <= warningAtSeconds;

  if (isTimeUp) {
    return (
      <span
        role="status"
        className={cn(
          'block font-semibold text-ada2-suspended motion-safe:animate-pulse',
          size === 'lg' ? 'text-[clamp(48px,7vw,96px)] leading-[1.1]' : 'text-[40px] leading-[1.15]',
          className
        )}
      >
        {timeUpLabel ?? formatTime(0)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'block [font-variant-numeric:tabular-nums_lining-nums]',
        TIMER_TEXT[size],
        !isWarning && !paused && 'text-ada2-ink',
        isWarning && 'text-ada2-suspended motion-safe:animate-pulse',
        paused && !isWarning && 'text-ada2-muted',
        className
      )}
    >
      {formatTime(remaining)}
    </span>
  );
}
