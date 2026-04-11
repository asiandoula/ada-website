'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';

function DesktopDropdown({
  label,
  links,
  isOpen,
  onOpen,
  onClose,
}: {
  label: string;
  links: { label: string; href: string }[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <button
        onClick={() => isOpen ? onClose() : onOpen()}
        onMouseEnter={onOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute left-0 top-full pt-2 z-50 transition-all duration-200 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onMouseLeave={onClose}
      >
        <div className="bg-white rounded-lg shadow-xl py-2 min-w-[220px] border border-gray-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2.5 text-sm text-ada-navy/70 hover:bg-ada-purple/5 hover:text-ada-purple transition-colors focus-visible:bg-ada-purple/5 focus-visible:text-ada-purple focus-visible:outline-none"
              onClick={onClose}
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
        aria-expanded={isOpen}
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
  const t = useTranslations('header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const aboutLinks = [
    { label: t('aboutUs'), href: '/about-us' },
    { label: t('ourHistory'), href: '/about-us/history' },
    { label: t('missionValues'), href: '/about-us/mission-value' },
    { label: t('boardOfDirectors'), href: '/about-us/board' },
  ];

  const certificationLinks = [
    { label: t('postpartumDoula'), href: '/certifications/postpartum-doula' },
    { label: t('birthDoula'), href: '/certifications/birth-doula' },
    { label: t('ibclc'), href: '/certifications/ibclc' },
  ];

  const doulaLinks = [
    { label: t('myPortal'), href: '/portal' },
    { label: t('renewRecertification'), href: '/for-doulas/renew' },
    { label: t('codeOfConduct'), href: '/for-doulas/code-of-conduct' },
    { label: t('verifyADoula'), href: '/verify' },
  ];

  const familyLinks = [
    { label: t('overview'), href: '/for-families' },
    { label: t('howWeTrain'), href: '/for-families/how-we-train' },
    { label: t('findADoula'), href: '/for-families/find-a-doula' },
    { label: t('verifyMyDoula'), href: '/verify' },
  ];

  const supportLinks = [
    { label: t('faq'), href: '/support/faq' },
    { label: t('contactUs'), href: '/support/contact' },
    { label: t('articles'), href: '/articles' },
  ];

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" style={{ backgroundColor: mobileOpen ? '#606090' : 'rgba(96, 96, 144, 0.85)', backdropFilter: mobileOpen ? 'none' : 'blur(8px)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
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
          <nav ref={navRef} className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <DesktopDropdown label={t('about')} links={aboutLinks} isOpen={openDropdown === 'about'} onOpen={() => setOpenDropdown('about')} onClose={() => setOpenDropdown(null)} />
            <DesktopDropdown label={t('certifications')} links={certificationLinks} isOpen={openDropdown === 'cert'} onOpen={() => setOpenDropdown('cert')} onClose={() => setOpenDropdown(null)} />
            <DesktopDropdown label={t('forFamilies')} links={familyLinks} isOpen={openDropdown === 'family'} onOpen={() => setOpenDropdown('family')} onClose={() => setOpenDropdown(null)} />
            <DesktopDropdown label={t('forDoulas')} links={doulaLinks} isOpen={openDropdown === 'doula'} onOpen={() => setOpenDropdown('doula')} onClose={() => setOpenDropdown(null)} />
            <DesktopDropdown label={t('support')} links={supportLinks} isOpen={openDropdown === 'support'} onOpen={() => setOpenDropdown('support')} onClose={() => setOpenDropdown(null)} />
          </nav>

          {/* Right side: Language + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/certifications"
              className="inline-flex items-center px-4 py-2.5 bg-white/15 text-white text-sm font-medium rounded-full hover:bg-white/25 transition-colors"
            >
              {t('getCertified')} &rarr;
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
              aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#606090' }}
        aria-hidden={!mobileOpen}
      >
        <nav className="px-6 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]" aria-label="Mobile navigation">
          <MobileAccordion
            label={t('about')}
            links={aboutLinks}
            isOpen={openAccordion === 'about'}
            onToggle={() => toggleAccordion('about')}
            onLinkClick={() => setMobileOpen(false)}
          />
          <MobileAccordion
            label={t('certifications')}
            links={certificationLinks}
            isOpen={openAccordion === 'cert'}
            onToggle={() => toggleAccordion('cert')}
            onLinkClick={() => setMobileOpen(false)}
          />
          <MobileAccordion
            label={t('forFamilies')}
            links={familyLinks}
            isOpen={openAccordion === 'family'}
            onToggle={() => toggleAccordion('family')}
            onLinkClick={() => setMobileOpen(false)}
          />
          <MobileAccordion
            label={t('forDoulas')}
            links={doulaLinks}
            isOpen={openAccordion === 'doula'}
            onToggle={() => toggleAccordion('doula')}
            onLinkClick={() => setMobileOpen(false)}
          />
          <MobileAccordion
            label={t('support')}
            links={supportLinks}
            isOpen={openAccordion === 'support'}
            onToggle={() => toggleAccordion('support')}
            onLinkClick={() => setMobileOpen(false)}
          />
          <div className="pt-6">
            <Link
              href="/certifications"
              className="block w-full text-center px-4 py-2.5 bg-ada-purple text-white font-medium text-sm rounded-full hover:bg-ada-purple-hover transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t('getCertified')} &rarr;
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
