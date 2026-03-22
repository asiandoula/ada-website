import Link from 'next/link';
import Image from 'next/image';
import { NewsletterForm } from './newsletter-form';

const doulaLinks = [
  { label: 'Postpartum Doula', href: '/certifications/postpartum-doula' },
  { label: 'Birth Doula', href: '/certifications/birth-doula' },
  { label: 'Renew / Recertification', href: '/for-doulas/renew' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
];

const familyLinks = [
  { label: 'Verify a Doula', href: '/verify' },
  { label: 'How We Train', href: '/for-families/how-we-train' },
  { label: 'Find a Doula', href: '/for-families/find-a-doula' },
];

const institutionLinks = [
  { label: 'Credential Verification', href: '/verify' },
  { label: 'Contact Us', href: '/support/contact' },
  { label: 'FAQ', href: '/support/faq' },
];

export function Footer() {
  return (
    <footer className="bg-ada-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/ada-logo-white.svg"
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

          {/* For Doulas */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              For Doulas
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

          {/* For Families */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              For Families
            </h3>
            <ul className="space-y-2.5">
              {familyLinks.map((link) => (
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

          {/* For Institutions */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              For Institutions
            </h3>
            <ul className="space-y-2.5">
              {institutionLinks.map((link) => (
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

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-outfit font-semibold text-sm">Stay connected with ADA</h3>
              <p className="text-white/60 text-xs mt-1">Training updates, certification news, and community stories.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-white/60 text-xs text-center">
            &copy; {new Date().getFullYear()} Asian Doula Alliance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
