'use client';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use and getting started.',
    cta: 'Get started free',
    ctaHref: '/signup',
    ctaVariant: 'secondary',
    popular: false,
    features: [
      '1 LinkNest page',
      'Up to 10 links',
      'Basic analytics (7-day)',
      'QR code generator',
      '3 theme presets',
      'LinkNest badge',
    ],
  },
  {
    name: 'Pro',
    price: '$6',
    period: 'per month',
    description: 'For creators who are serious about their audience.',
    cta: 'Start Pro free trial',
    ctaHref: '/signup?plan=pro',
    ctaVariant: 'primary',
    popular: true,
    features: [
      'Unlimited links',
      'Advanced analytics (90-day)',
      'Custom domain',
      'Priority link ordering',
      'All theme presets + custom',
      'Digital business card',
      'No LinkNest badge',
      'Email support',
    ],
  },
  {
    name: 'Business',
    price: '$18',
    period: 'per month',
    description: 'For teams, brands, and agencies managing multiple pages.',
    cta: 'Contact us',
    ctaHref: '/signup?plan=business',
    ctaVariant: 'outline',
    popular: false,
    features: [
      'Everything in Pro',
      'Up to 5 team pages',
      'Analytics export (CSV)',
      'Branded QR with logo',
      'API access',
      'Priority support',
      'Custom onboarding',
    ],
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-24 border-t border-white/10 bg-[#05060f] scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-teal-400 shadow-xs">
            Simple, transparent pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Start free. Upgrade when you&rsquo;re ready.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            No credit card required to get started. Cancel any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={[
                'relative flex flex-col rounded-3xl p-8 border transition-all duration-200 backdrop-blur-md',
                plan.popular
                  ? 'bg-gradient-to-b from-[#161a38] to-[#0e1329] border-teal-400/40 text-white shadow-2xl ring-1 ring-teal-400/20 scale-[1.03]'
                  : 'bg-[#0b0e20]/70 border-white/10 text-white shadow-lg hover:border-white/25 hover:bg-[#0f132b]/80',
              ].join(' ')}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 text-white text-xs font-bold shadow-md">
                    <Zap size={11} />
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="space-y-1 mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-400">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {plan.description}
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href={plan.ctaHref}
                className={[
                  'w-full inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold transition-all duration-150 active:scale-[0.98] mb-8 cursor-pointer',
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 text-white shadow-md hover:opacity-95'
                    : plan.ctaVariant === 'outline'
                    ? 'border border-white/20 text-slate-200 hover:bg-white/[0.08] hover:border-white/30'
                    : 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/15',
                ].join(' ')}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="mb-6 border-t border-white/10" />

              {/* Feature List */}
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-xs sm:text-sm">
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      className="mt-0.5 shrink-0 text-teal-400"
                    />
                    <span className="text-slate-300">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
