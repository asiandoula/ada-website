'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  target: number;
  label: string;
  suffix?: string;
  numberClassName?: string;
  labelClassName?: string;
}

export function Counter({ target, label, suffix = '+', numberClassName = 'text-ada-purple', labelClassName = 'text-ada-navy/70' }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [hasStarted, target]);

  return (
    <div ref={ref} className="text-center">
      <div className={`font-outfit text-4xl md:text-5xl font-semibold ${numberClassName}`}>
        {count}
        {suffix}
      </div>
      <div className={`mt-2 text-sm font-medium ${labelClassName}`}>{label}</div>
    </div>
  );
}
