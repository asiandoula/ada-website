'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreItem {
  label: string;
  score: number;
}

export function ScoreBreakdown({ scores }: { scores: ScoreItem[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="pt-6 pb-6 px-8">
        <h2 className="text-lg font-dm-serif text-ada-navy mb-5">
          Score Breakdown
        </h2>
        <div className="space-y-4">
          {scores.map((item, index) => (
            <div
              key={item.label}
              className="transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transitionDelay: `${index * 80}ms`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{item.label}</span>
                <span
                  className={`text-sm font-semibold ${
                    item.score >= 70 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.score}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    item.score >= 70 ? 'bg-ada-purple' : 'bg-red-400'
                  }`}
                  style={{
                    width: visible ? `${Math.min(item.score, 100)}%` : '0%',
                    transitionDelay: `${index * 80 + 200}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
