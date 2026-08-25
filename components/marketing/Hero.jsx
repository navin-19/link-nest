'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  function handleGetStarted(e) {
    if (e) e.preventDefault();
    const clean = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    if (!clean) {
      router.push('/signup');
      return;
    }
    router.push(`/signup?username=${encodeURIComponent(clean)}`);
  }

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline, Description & Inline Signup */}
        <div className="lg:col-span-7 space-y-8 text-left relative z-10">
          {/* Subtle announcement badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-xs font-medium text-stone-700">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            The clean, modern link-in-bio platform
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.08]">
              One link for <br className="hidden sm:inline" />
              <span className="text-stone-900">everything you are.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Join thousands of creators using LinkNest to share everything you create, curate, and sell — from Instagram, TikTok, YouTube, and beyond, all unified in one beautifully simple link.
            </p>
          </div>

          {/* Inline Signup Input Bar */}
          <form
            onSubmit={handleGetStarted}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 bg-white border border-stone-300/80 rounded-2xl sm:rounded-full shadow-sm hover:border-stone-400 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all max-w-lg relative z-20"
          >
            <div className="flex items-center flex-1 px-4 py-2.5 sm:py-2">
              <span className="text-stone-400 font-medium text-sm select-none">
                linknest.app/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="w-full bg-transparent text-stone-900 font-medium text-sm focus:outline-none pl-1 placeholder:text-stone-300"
              />
            </div>

            <button
              type="button"
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl sm:rounded-full transition-all shadow-sm shrink-0 active:scale-[0.98] cursor-pointer"
            >
              Get started for free
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Micro social proof */}
          <div className="flex items-center gap-6 text-xs text-stone-500 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Custom themes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Built-in analytics
            </span>
          </div>
        </div>

        {/* Right Column: Editorial Lifestyle + Phone Mockup Composite */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative">
          {/* Subtle background ambient blur */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-stone-200/60 via-indigo-100/40 to-stone-100/50 rounded-[40px] blur-2xl -z-10 pointer-events-none" />

          {/* Phone Mockup Frame */}
          <div className="w-full max-w-[340px] bg-stone-900 p-3 rounded-[44px] shadow-2xl border border-stone-800/80 transition-transform duration-300 hover:scale-[1.01]">
            {/* Screen View */}
            <div className="bg-stone-50 rounded-[34px] p-5 pt-8 overflow-hidden text-stone-900 space-y-5 border border-stone-200/60 shadow-inner">
              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-stone-900 rounded-full mx-auto mb-2" />

              {/* Profile Card Header */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow-md ring-4 ring-white">
                  AR
                </div>
                <div>
                  <h2 className="font-bold text-base text-stone-900">Alex Rivers</h2>
                  <p className="text-xs text-stone-500 font-medium">@alexrivers</p>
                </div>
                <p className="text-xs text-stone-600 max-w-[220px] leading-relaxed">
                  Design systems & visual storyteller. Sharing weekly projects and creative notes.
                </p>
              </div>

              {/* Social Icon Bar */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                  <Instagram size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                  <Youtube size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                  <Twitter size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                  <Globe size={14} />
                </div>
              </div>

              {/* Sample Links */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-white border border-stone-200/80 rounded-2xl shadow-xs hover:border-stone-400 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-xs font-semibold text-stone-800">
                      Latest Design Case Study
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-stone-400" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white border border-stone-200/80 rounded-2xl shadow-xs hover:border-stone-400 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                      <ShoppingBag size={14} />
                    </div>
                    <span className="text-xs font-semibold text-stone-800">
                      Digital Creator Toolkit
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-stone-400" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white border border-stone-200/80 rounded-2xl shadow-xs hover:border-stone-400 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                      <Globe size={14} />
                    </div>
                    <span className="text-xs font-semibold text-stone-800">
                      Personal Journal & Essays
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-stone-400" />
                </div>
              </div>

              {/* Mockup Badge Footer */}
              <div className="text-center pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  LinkNest
                </span>
              </div>
            </div>
          </div>

          {/* Underlay Caption Text */}
          <p className="text-xs text-stone-400 mt-4 text-center lg:text-right font-medium">
            Live interactive preview powered by LinkNest SSR
          </p>
        </div>
      </div>
    </section>
  );
}
