import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Our History', href: '/about-us/history' },
  { label: 'Mission & Values', href: '/about-us/mission-value' },
];

const doulaLinks = [
  { label: 'Steps to Certification', href: '/become-a-doula/steps-to-certification' },
  { label: 'License & Exam', href: '/become-a-doula/license-and-exam' },
  { label: 'Renew / Recertification', href: '/become-a-doula/renew-recertification' },
  { label: 'Find a Doula Training', href: '/become-a-doula/find-a-doula-training' },
  { label: 'Code of Conduct', href: '/become-a-doula/code-of-conduct' },
];

export function Footer() {
  return (
    <footer className="bg-ada-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/ada-logo.svg"
                alt="Asian Doula Alliance Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-outfit font-semibold text-sm tracking-wide">
                ASIAN DOULA ALLIANCE
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Setting standards in postpartum care through culturally integrated
              training, certification, and multilingual support for Asian doulas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Become a Doula */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              Become a Doula
            </h3>
            <ul className="space-y-2.5">
              {doulaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li>
                <a href="tel:+17142026501" className="hover:text-white transition-colors">
                  +1 (714) 202-6501
                </a>
              </li>
              <li>
                <a href="mailto:contact@asiandoula.org" className="hover:text-white transition-colors">
                  contact@asiandoula.org
                </a>
              </li>
              <li>Available Mon-Fri 10AM-5PM PST</li>
              <li className="pt-2">
                <a
                  href="https://www.instagram.com/asian_doula"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @asian_doula
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-white/40 text-xs text-center">
            &copy; 2026 Asian Doula Alliance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
