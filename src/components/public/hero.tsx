'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(12, 34, 49, 0.7)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32 lg:pb-40">
        <h1
          className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight animate-hero-title"
        >
          Bridging Cultures, Supporting Moms, Celebrating Life
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl animate-hero-subtitle">
          Asian Doula Alliance is a 501(c)(3) non-profit dedicated to setting standards
          in postpartum care through culturally integrated training, certification,
          and multilingual support.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 animate-hero-buttons">
          <Link
            href="/become-a-doula/steps-to-certification"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-3 text-white font-medium transition-colors hover:bg-white hover:text-ada-navy"
          >
            I&apos;m a Caregiver
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/become-a-doula/find-a-doula-training"
            className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-8 py-3 text-white font-medium transition-colors hover:bg-ada-purple-accent"
          >
            Find a Doula
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* CSS keyframe animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-hero-title {
          animation: fadeSlideUp 0.8s ease-out both;
        }
        .animate-hero-subtitle {
          animation: fadeSlideUp 0.8s ease-out 0.2s both;
        }
        .animate-hero-buttons {
          animation: fadeSlideUp 0.8s ease-out 0.4s both;
        }
      `}</style>
    </section>
  );
}
