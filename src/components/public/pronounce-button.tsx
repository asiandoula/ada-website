'use client';

import { useState } from 'react';

interface PronounceButtonProps {
  text: string;
  lang: string; // BCP 47: 'zh-CN', 'ko-KR', 'ja-JP'
  label: string; // e.g. "zuò yuè zi"
}

export function PronounceButton({ text, lang, label }: PronounceButtonProps) {
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slower for learning

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Listen to pronunciation: ${label}`}
      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-ada-purple/10 text-ada-purple text-xs font-outfit font-medium hover:bg-ada-purple/20 transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={`w-3.5 h-3.5 ${playing ? 'animate-pulse' : ''}`}
      >
        {playing ? (
          <>
            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
          </>
        ) : (
          <polygon points="5,3 19,12 5,21" fill="currentColor" />
        )}
      </svg>
      {label}
    </button>
  );
}
