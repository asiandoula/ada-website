'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ada-cream px-6 overflow-hidden">
      {/* Soft radial glow behind content */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
      />

      <div className="relative text-center max-w-md">
        {/* 404 — staggered fade in + gentle float */}
        <p
          className="font-outfit text-[10rem] leading-none font-bold text-ada-purple/15 select-none animate-[fadeFloat_1s_ease-out_both]"
        >
          404
        </p>

        {/* Heading — fade up with delay */}
        <h1
          className="mt-2 font-dm-serif text-3xl text-ada-navy animate-[fadeUp_0.6s_ease-out_0.15s_both]"
        >
          Page not found
        </h1>

        {/* Description — fade up with more delay */}
        <p
          className="mt-4 text-ada-navy/60 leading-relaxed animate-[fadeUp_0.6s_ease-out_0.3s_both]"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Buttons — fade up last */}
        <div
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-[fadeUp_0.6s_ease-out_0.45s_both]"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            Back to Home
          </Link>
          <Link
            href="/support/contact"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm border-2 border-ada-purple/30 text-ada-purple font-medium rounded-full hover:bg-ada-purple/5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeFloat {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeFloat_1s_ease-out_both\\],
          .animate-\\[fadeUp_0\\.6s_ease-out_0\\.15s_both\\],
          .animate-\\[fadeUp_0\\.6s_ease-out_0\\.3s_both\\],
          .animate-\\[fadeUp_0\\.6s_ease-out_0\\.45s_both\\] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
