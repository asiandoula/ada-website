'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  darkMode?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialCarousel({ testimonials, darkMode, autoPlay = true, interval = 5000 }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-rotate
  useEffect(() => {
    if (!autoPlay || paused) return;
    timerRef.current = setInterval(next, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, paused, next, interval]);

  // Pause on hover/focus
  const handlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return (
    <div className="relative max-w-3xl mx-auto" {...handlers} aria-roledescription="carousel" aria-label="Testimonials">
      {/* Testimonial content */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
          aria-live="off"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 px-4 md:px-12"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${testimonials.length}`}
            >
              <blockquote className="text-center">
                <p className={`text-lg md:text-xl italic leading-relaxed font-dm-serif ${darkMode ? 'text-white' : 'text-ada-navy'}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6">
                  <div className={`font-outfit font-semibold ${darkMode ? 'text-white' : 'text-ada-navy'}`}>{t.name}</div>
                  <div className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-ada-navy/40'}`}>{t.role}</div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => { prev(); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ada-purple/40 ${
          darkMode ? 'bg-white/10 text-white/60 hover:text-white' : 'bg-white shadow-md text-ada-navy/40 hover:text-ada-purple'
        }`}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => { next(); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 p-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ada-purple/40 ${
          darkMode ? 'bg-white/10 text-white/60 hover:text-white' : 'bg-white shadow-md text-ada-navy/40 hover:text-ada-purple'
        }`}
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? (darkMode ? 'bg-white scale-125' : 'bg-ada-purple scale-125')
                : (darkMode ? 'bg-white/30' : 'bg-ada-navy/15')
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
