'use client';

import { useState } from 'react';

const STEP_COLORS = {
  1: { bg: '#e6f7fe', accent: '#00aeef', ring: 'ring-[#00aeef]' },
  2: { bg: '#f3ebf9', accent: '#662d91', ring: 'ring-[#662d91]' },
  3: { bg: '#fdede7', accent: '#f15a29', ring: 'ring-[#f15a29]' },
  4: { bg: '#f3f9eb', accent: '#8dc63f', ring: 'ring-[#8dc63f]' },
} as const;

export function RenewalSteps() {
  const [activeStep, setActiveStep] = useState(1);
  const [activePathway, setActivePathway] = useState<'A' | 'B'>('A');

  return (
    <div className="relative">
      {/* Section heading */}
      <h2 className="font-dm-serif text-3xl text-ada-navy mb-10">
        How to Renew
      </h2>

      <div className="flex gap-6 md:gap-10">
        {/* Timeline track */}
        <div className="flex flex-col items-center shrink-0">
          {[1, 2, 3, 4].map((step) => {
            const colors = STEP_COLORS[step as keyof typeof STEP_COLORS];
            const isActive = activeStep === step;
            return (
              <div key={step} className="flex flex-col items-center">
                {/* Step circle */}
                <button
                  onClick={() => setActiveStep(step)}
                  className={`
                    relative w-11 h-11 rounded-full flex items-center justify-center
                    font-outfit font-bold text-sm transition-all duration-300 cursor-pointer
                    ${isActive
                      ? `ring-4 ${colors.ring} ring-offset-2 text-white scale-110`
                      : 'bg-white border-2 border-gray-200 text-ada-navy/40 hover:border-gray-300'
                    }
                  `}
                  style={isActive ? { backgroundColor: colors.accent } : undefined}
                >
                  {step}
                </button>
                {/* Connector line */}
                {step < 4 && (
                  <div
                    className="w-0.5 transition-all duration-300"
                    style={{
                      height: activeStep === step ? '100%' : '48px',
                      minHeight: '48px',
                      backgroundColor: activeStep >= step + 1 ? colors.accent : '#e5e7eb',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content panels */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Step 1 */}
          <StepPanel
            step={1}
            activeStep={activeStep}
            onToggle={() => setActiveStep(activeStep === 1 ? 0 : 1)}
            title="Check Your Certification Status"
          >
            <p className="text-ada-navy/70 leading-relaxed mb-4">
              Verify your current certification status and expiration date using the
              Doula Verification tool or your Doula Portal.
            </p>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                You&apos;ll need:
              </p>
              <ul className="space-y-2.5 text-sm text-ada-navy/70">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: STEP_COLORS[1].accent }} />
                  Your Doula ID (format: #YY-NNNN), found on your original certificate
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: STEP_COLORS[1].accent }} />
                  Your registered email address
                </li>
              </ul>
            </div>
          </StepPanel>

          {/* Step 2 */}
          <StepPanel
            step={2}
            activeStep={activeStep}
            onToggle={() => setActiveStep(activeStep === 2 ? 0 : 2)}
            title="Choose Your Renewal Pathway"
          >
            <p className="text-ada-navy/70 leading-relaxed mb-5">
              ADA offers two pathways to renew your certification. Choose the one that works best for you.
            </p>

            {/* Pathway tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActivePathway('A')}
                  className={`
                    flex-1 py-3.5 px-4 font-outfit text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${activePathway === 'A'
                      ? 'text-ada-purple border-b-2 border-ada-purple bg-[#f3ebf9]/30'
                      : 'text-ada-navy/40 hover:text-ada-navy/60'
                    }
                  `}
                >
                  Pathway A: Reference Letters
                </button>
                <button
                  onClick={() => setActivePathway('B')}
                  className={`
                    flex-1 py-3.5 px-4 font-outfit text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${activePathway === 'B'
                      ? 'text-ada-navy border-b-2 border-ada-navy bg-ada-navy/5'
                      : 'text-ada-navy/40 hover:text-ada-navy/60'
                    }
                  `}
                >
                  Pathway B: Recertification Exam
                </button>
              </div>

              <div className="p-6">
                {activePathway === 'A' ? (
                  <div className="animate-in fade-in duration-200">
                    <p className="text-ada-navy/70 leading-relaxed mb-5">
                      Submit 3 professional reference letters from clients, colleagues, or
                      healthcare professionals who can speak to your work as a doula.
                    </p>
                    <div className="bg-[#f3ebf9]/40 rounded-xl p-5">
                      <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                        Each reference must include:
                      </p>
                      <ul className="space-y-2.5 text-sm text-ada-navy/70">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Full name of the reference
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Phone number or email address
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Written recommendation describing your doula work
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200">
                    <p className="text-ada-navy/70 leading-relaxed mb-5">
                      Take a shorter recertification exam to demonstrate your continued
                      competency in postpartum doula care.
                    </p>
                    <div className="bg-ada-navy/5 rounded-xl p-5">
                      <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                        Exam details:
                      </p>
                      <ul className="space-y-2.5 text-sm text-ada-navy/70">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ada-navy shrink-0" />
                          Shorter than the initial certification exam
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ada-navy shrink-0" />
                          Covers updated practices and protocols
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ada-navy shrink-0" />
                          Passing score: 70/100
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </StepPanel>

          {/* Step 3 */}
          <StepPanel
            step={3}
            activeStep={activeStep}
            onToggle={() => setActiveStep(activeStep === 3 ? 0 : 3)}
            title="Submit Your Renewal Application"
          >
            <p className="text-ada-navy/70 leading-relaxed mb-4">
              Submit your renewal application along with your chosen pathway materials
              (reference letters or exam results) and the <strong className="text-ada-navy">$100 renewal fee</strong>.
            </p>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                Contact us to begin:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-ada-navy/70">
                  Email:{' '}
                  <a href="mailto:contact@asiandoula.org" className="text-ada-purple hover:underline">
                    contact@asiandoula.org
                  </a>
                </p>
                <p className="text-ada-navy/70">
                  Phone:{' '}
                  <a href="tel:+17142026501" className="text-ada-purple hover:underline">
                    (714) 202-6501
                  </a>
                </p>
              </div>
            </div>
          </StepPanel>

          {/* Step 4 */}
          <StepPanel
            step={4}
            activeStep={activeStep}
            onToggle={() => setActiveStep(activeStep === 4 ? 0 : 4)}
            title="Receive Your Renewed Certification"
          >
            <p className="text-ada-navy/70 leading-relaxed mb-4">
              Once your application is reviewed and approved, you will receive your
              renewed certification, valid for another <strong className="text-ada-navy">1 year</strong> from the renewal date.
            </p>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                You&apos;ll receive:
              </p>
              <ul className="space-y-2.5 text-sm text-ada-navy/70">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: STEP_COLORS[4].accent }} />
                  Updated digital certificate
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: STEP_COLORS[4].accent }} />
                  Verification status updated in Doula Portal
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: STEP_COLORS[4].accent }} />
                  Insurance panel eligibility maintained
                </li>
              </ul>
            </div>
          </StepPanel>
        </div>
      </div>
    </div>
  );
}

function StepPanel({
  step,
  activeStep,
  onToggle,
  title,
  children,
}: {
  step: number;
  activeStep: number;
  onToggle: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const isActive = activeStep === step;
  const colors = STEP_COLORS[step as keyof typeof STEP_COLORS];

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300 overflow-hidden
        ${isActive ? 'shadow-sm' : ''}
      `}
      style={isActive ? { backgroundColor: colors.bg } : undefined}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 text-left transition-all duration-200 cursor-pointer
          ${isActive ? 'p-6 pb-4' : 'py-4 px-2 hover:px-4'}
        `}
      >
        <h3
          className={`
            font-dm-serif transition-all duration-200
            ${isActive ? 'text-xl md:text-2xl text-ada-navy' : 'text-lg text-ada-navy/50'}
          `}
        >
          {title}
        </h3>
        <svg
          className={`ml-auto w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'rotate-180 text-ada-navy/40' : 'text-ada-navy/20'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content — expandable */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isActive ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{ overflow: isActive ? 'visible' : 'hidden' }}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
