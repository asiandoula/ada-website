'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

const aboutLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Our History', href: '/about-us/history' },
  { label: 'Mission & Values', href: '/about-us/mission-value' },
];

const doulaLinks = [
  { label: 'Steps to Certification', href: '/become-a-doula/steps-to-certification' },
  { label: 'License & Exam', href: '/become-a-doula/license-and-exam' },
  { label: 'Renew / Recertification', href: '/become-a-doula/renew-recertification' },
  { label: 'Code of Conduct', href: '/become-a-doula/code-of-conduct' },
];

const familyLinks = [
  { label: 'Verify a Doula', href: '/verify' },
  { label: 'How We Train', href: '/for-families/how-we-train' },
  { label: 'Find a Doula', href: '/for-families/find-a-doula' },
];

const programLinks = [
  { label: 'Find a Training', href: '/become-a-doula/find-a-doula-training' },
  { label: 'Scholarship Program', href: '/programs/scholarship' },
];

const supportLinks = [
  { label: 'FAQ', href: '/support/faq' },
  { label: 'Contact Us', href: '/support/contact' },
  { label: 'Articles', href: '/articles' },
];

function DesktopDropdown({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium py-2 transition-colors">
        {label}
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white rounded-lg shadow-xl py-2 min-w-[220px] border border-gray-100">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-ada-purple/5 hover:text-ada-purple transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileAccordion({
  label,
  links,
  isOpen,
  onToggle,
  onLinkClick,
}: {
  label: string;
  links: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-white text-lg font-medium py-3 border-b border-white/10"
      >
        {label}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pl-4 pb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 text-white/70 hover:text-white text-base transition-colors"
              onClick={onLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(96, 96, 144, 0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/ada-logo-white.svg"
              alt="Asian Doula Alliance Logo"
              width={32}
              height={32}
              className="h-7 w-7 lg:h-8 lg:w-8"
            />
            <span className="text-white font-outfit font-semibold text-sm lg:text-base tracking-wide hidden sm:block">
              ASIAN DOULA ALLIANCE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <DesktopDropdown label="About" links={aboutLinks} />
            <DesktopDropdown label="For Doulas" links={doulaLinks} />
            <DesktopDropdown label="For Families" links={familyLinks} />
            <DesktopDropdown label="Programs" links={programLinks} />
            <DesktopDropdown label="Support" links={supportLinks} />
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              href="/become-a-doula/steps-to-certification"
              className="inline-flex items-center px-5 py-2.5 bg-white/15 text-white text-sm font-medium rounded-full hover:bg-white/25 transition-colors"
            >
              Get Certified →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`lg:hidden fixed inset-0 top-16 z-40 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: 'rgba(96, 96, 144, 0.95)' }}>
          <nav className="px-6 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <MobileAccordion
              label="About"
              links={aboutLinks}
              isOpen={openAccordion === 'about'}
              onToggle={() => toggleAccordion('about')}
              onLinkClick={() => setMobileOpen(false)}
            />
            <MobileAccordion
              label="For Doulas"
              links={doulaLinks}
              isOpen={openAccordion === 'doula'}
              onToggle={() => toggleAccordion('doula')}
              onLinkClick={() => setMobileOpen(false)}
            />
            <MobileAccordion
              label="For Families"
              links={familyLinks}
              isOpen={openAccordion === 'family'}
              onToggle={() => toggleAccordion('family')}
              onLinkClick={() => setMobileOpen(false)}
            />
            <MobileAccordion
              label="Programs"
              links={programLinks}
              isOpen={openAccordion === 'program'}
              onToggle={() => toggleAccordion('program')}
              onLinkClick={() => setMobileOpen(false)}
            />
            <MobileAccordion
              label="Support"
              links={supportLinks}
              isOpen={openAccordion === 'support'}
              onToggle={() => toggleAccordion('support')}
              onLinkClick={() => setMobileOpen(false)}
            />
            <div className="pt-6">
              <Link
                href="/become-a-doula/steps-to-certification"
                className="block w-full text-center px-5 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Certified →
              </Link>
            </div>
          </nav>
      </div>
    </header>
  );
}
