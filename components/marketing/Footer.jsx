import Link from 'next/link';
import { Link2, Twitter, Github, Instagram } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Sign in', href: '/login' },
  { label: 'Sign up', href: '/signup' },
];

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: 'https://twitter.com', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-stone-900 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-white">
                <Link2 size={14} strokeWidth={2.5} />
              </div>
              LinkNest
            </Link>
            <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
              One link for everything you create, share, and sell.
            </p>
          </div>

          {/* Nav Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {FOOTER_NAV.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-100">
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} LinkNest. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 transition-all"
              >
                <Icon size={14} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
