'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  durationSeconds: number;
  startedAt?: string;
  onTimeUp?: () => void;
  warningAtSeconds?: number;
  size?: 'sm' | 'lg';
  paused?: boolean;
  playSound?: boolean; // play alert sound when time's up (default: true)
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

export function CountdownTimer({
  durationSeconds,
  startedAt,
  onTimeUp,
  warningAtSeconds = 900,
  size = 'lg',
  paused = false,
  playSound = true,
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
        className={cn(
          'text-red-500 font-semibold animate-pulse',
          size === 'lg' && 'block text-center text-4xl font-dm-serif',
          size === 'sm' && 'inline text-5xl font-outfit font-semibold'
        )}
      >
        Time&apos;s up! 时间到！
      </span>
    );
  }

  return (
    <span
      className={cn(
        'tabular-nums',
        !isWarning && 'text-ada-navy',
        isWarning && 'text-red-500 animate-pulse',
        paused && 'opacity-50',
        size === 'lg' && 'block text-center text-6xl font-dm-serif',
        size === 'sm' && 'inline text-5xl font-outfit font-semibold'
      )}
    >
      {formatTime(remaining)}
    </span>
  );
}
