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
      className="py-24 border-t border-stone-200/80 bg-stone-50 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 text-xs font-medium text-stone-600 shadow-xs">
            Simple, transparent pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Start free. Upgrade when you&rsquo;re ready.
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            No credit card required to get started. Cancel any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={[
                'relative flex flex-col rounded-3xl p-8 border transition-all duration-200',
                plan.popular
                  ? 'bg-stone-900 border-stone-900 text-white shadow-xl scale-[1.02]'
                  : 'bg-white border-stone-200/80 text-stone-900 shadow-soft hover:shadow-card hover:border-stone-400',
              ].join(' ')}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
                    <Zap size={11} />
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="space-y-1 mb-6">
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    plan.popular ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      plan.popular ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    plan.popular ? 'text-stone-400' : 'text-stone-600'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href={plan.ctaHref}
                className={[
                  'w-full inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-150 active:scale-[0.98] mb-8',
                  plan.popular
                    ? 'bg-white text-stone-900 hover:bg-stone-100 shadow-btn'
                    : plan.ctaVariant === 'outline'
                    ? 'border border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400'
                    : 'bg-stone-900 text-white hover:bg-stone-800 shadow-btn',
                ].join(' ')}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div
                className={`mb-6 border-t ${
                  plan.popular ? 'border-stone-800' : 'border-stone-100'
                }`}
              />

              {/* Feature List */}
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      className={`mt-0.5 shrink-0 ${
                        plan.popular ? 'text-indigo-400' : 'text-indigo-600'
                      }`}
                    />
                    <span
                      className={
                        plan.popular ? 'text-stone-300' : 'text-stone-700'
                      }
                    >
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
