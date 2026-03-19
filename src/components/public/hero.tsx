'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end">
      {/* Background image with warm gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(12,34,49,0.8), rgba(26,51,70,0.75))',
          }}
        />
      </div>

      {/* Content — left aligned */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 md:pb-32 lg:pb-40">
        <div className="max-w-[60%] max-lg:max-w-full">
          <h1 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight animate-hero-title">
            Bridging Cultures, Supporting Moms, Celebrating Life
          </h1>

          <p className="mt-6 font-light text-lg md:text-xl text-white/55 max-w-2xl animate-hero-subtitle">
            Asian Doula Alliance is a 501(c)(3) non-profit dedicated to setting standards
            in postpartum care through culturally integrated training, certification,
            and multilingual support.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-hero-buttons">
            <Link
              href="/become-a-doula/steps-to-certification"
              className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-8 py-3 text-white font-medium transition-colors hover:bg-ada-purple-hover"
            >
              For Doulas
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/become-a-doula/find-a-doula-training"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/40 px-8 py-3 text-white font-medium transition-colors hover:bg-white/10"
            >
              For Families
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
