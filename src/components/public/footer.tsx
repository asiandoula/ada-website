import Link from 'next/link';
import Image from 'next/image';

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
              <p className="text-white/40 text-xs mt-1">Training updates, certification news, and community stories.</p>
            </div>
            <div className="flex gap-2 max-w-sm w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                readOnly
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-full bg-white/10 text-white text-sm placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-white/30"
              />
              <a
                href="mailto:contact@asiandoula.org?subject=Newsletter%20Signup"
                className="px-5 py-2.5 rounded-full bg-ada-purple text-white text-sm font-medium hover:bg-ada-purple-hover transition-colors shrink-0"
              >
                Subscribe
              </a>
            </div>
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
