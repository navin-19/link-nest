import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden p-12 sm:p-20 rounded-[40px] bg-stone-900 text-white text-center space-y-8 shadow-2xl">
          {/* Ambient glow orbs */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl pointer-events-none"
          />

          {/* Copy */}
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Your audience is one link away.
            </h2>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed">
              Claim your free LinkNest page in seconds — no credit card, no
              setup headaches.
            </p>
          </div>

          {/* CTAs */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-stone-900 hover:bg-stone-100 rounded-full font-semibold text-sm transition-all shadow-btn active:scale-[0.98]"
            >
              Try for free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white rounded-full font-semibold text-sm transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
