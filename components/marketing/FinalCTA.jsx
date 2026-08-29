import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden p-12 sm:p-20 rounded-[40px] bg-gradient-to-b from-[#111533] to-[#0b0d1e] border border-white/15 text-white text-center space-y-8 shadow-2xl">
          {/* Ambient glow orbs */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"
          />

          {/* Copy */}
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Your audience is one link away.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Claim your free LinkNest page in seconds — no credit card, no
              setup headaches.
            </p>
          </div>

          {/* CTAs */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.98]"
            >
              <span>Sign up free</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-slate-200 hover:text-white rounded-full font-semibold text-xs sm:text-sm transition-all backdrop-blur-md"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
