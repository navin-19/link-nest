import Navbar from '@/components/marketing/Navbar';
import Hero from '@/components/marketing/Hero';
import Link from 'next/link';
import {
  Palette,
  BarChart3,
  QrCode,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'LinkNest — One link for everything you are',
  description:
    'Join thousands of creators using LinkNest to share everything you create, curate and sell from one clean, modern bio link.',
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 selection:bg-stone-900 selection:text-white font-sans">
      {/* 1. Sticky Floating Navbar */}
      <Navbar />

      {/* 2. Main Hero Section */}
      <main>
        <Hero />

        {/* 3. Subtle Features Section */}
        <section className="py-20 border-t border-stone-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                Built for modern creators & brands
              </h2>
              <p className="text-stone-600 text-base">
                Everything you need to showcase your work, monetize links, and understand your audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-stone-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-xs">
                  <Palette size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Custom Themes</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Design a page that matches your brand with curated presets, bespoke gradients, custom button aesthetics, and typography.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-stone-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-xs">
                  <Zap size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Drag & Drop Reordering</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Easily prioritize your top content with smooth drag-and-drop link sorting and an instant live device preview mockup.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-stone-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-xs">
                  <BarChart3 size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Real-Time Analytics</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Track visits, click-through rates, top-performing links, and viewer distribution with clean interactive charts.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-stone-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-xs">
                  <QrCode size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Instant QR Codes</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Bridge physical and digital with dynamic high-resolution QR codes ready for events, packaging, merchandise, and cards.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-stone-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-xs">
                  <Smartphone size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Blazing Fast SSR</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Next.js App Router server-side rendering guarantees instant first paint and rich dynamic OpenGraph preview cards for social media.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-stone-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-xs">
                  <Shield size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Postgres & RLS Security</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Protected with Supabase Row Level Security so your private data stays secure while your public profile loads anywhere instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Bottom Call to Action Banner */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-10 sm:p-16 rounded-[40px] bg-stone-900 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-3 relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Ready to create your LinkNest?
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Join creators, designers, and founders sharing their universe from one simple link.
              </p>
            </div>

            <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-stone-900 hover:bg-stone-100 rounded-full font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
              >
                Claim your link
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-stone-800 text-white hover:bg-stone-700 border border-stone-700 rounded-full font-semibold text-sm transition-all"
              >
                Log in to dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Minimal Editorial Footer */}
      <footer className="border-t border-stone-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
              L
            </div>
            <span>&copy; {new Date().getFullYear()} LinkNest. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-stone-900 transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-stone-900 transition-colors">Log In</Link>
            <Link href="/signup" className="hover:text-stone-900 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
