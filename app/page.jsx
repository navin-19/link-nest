import Navbar from '@/components/marketing/Navbar';
import Hero from '@/components/marketing/Hero';
import ProductSection from '@/components/marketing/ProductSection';
import PricingSection from '@/components/marketing/PricingSection';
import FinalCTA from '@/components/marketing/FinalCTA';
import Footer from '@/components/marketing/Footer';

export const metadata = {
  title: 'LinkNest — One link for everything you are',
  description:
    'Join thousands of creators using LinkNest to share everything you create, curate and sell from one clean, modern bio link.',
};

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen bg-[#05060f] text-slate-100 selection:bg-teal-500 selection:text-white font-sans overflow-x-hidden">
      {/* ── Layered Ambient Glow & Radiating Grid / Light-Beam Graphic (z-0) ──── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Top-Center Soft Purple/Indigo Radial Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-75" />

        {/* Diagonal Soft Cyan/Blue Glow Beam */}
        <div className="absolute top-24 -left-48 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Bottom-Right Radiating Grid & Light-Beam Graphic */}
        <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] pointer-events-none">
          {/* Radial amber/cyan ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/15 via-indigo-600/15 to-transparent rounded-full blur-3xl" />

          {/* SVG Radiating Grid & Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grid-fade" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#05060f" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Concentric Circles */}
            <circle cx="650" cy="650" r="150" stroke="url(#grid-fade)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="650" cy="650" r="300" stroke="url(#grid-fade)" strokeWidth="1" />
            <circle cx="650" cy="650" r="450" stroke="url(#grid-fade)" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="650" cy="650" r="600" stroke="url(#grid-fade)" strokeWidth="1" />
            {/* Radiating Rays */}
            <line x1="650" y1="650" x2="50" y2="50" stroke="url(#grid-fade)" strokeWidth="1.5" />
            <line x1="650" y1="650" x2="200" y2="50" stroke="url(#grid-fade)" strokeWidth="1" />
            <line x1="650" y1="650" x2="50" y2="200" stroke="url(#grid-fade)" strokeWidth="1" />
            <line x1="650" y1="650" x2="0" y2="450" stroke="url(#grid-fade)" strokeWidth="1" />
            <line x1="650" y1="650" x2="450" y2="0" stroke="url(#grid-fade)" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* ── Main Content Layer (z-10) ────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Sticky Floating Navbar */}
        <Navbar />

        <main className="flex-1">
          {/* 2. Hero */}
          <Hero />

          {/* 3. Product Features */}
          <ProductSection />

          {/* 4. Pricing */}
          <PricingSection />

          {/* 5. Final CTA */}
          <FinalCTA />
        </main>

        {/* 6. Footer */}
        <Footer />
      </div>
    </div>
  );
}
