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
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 selection:bg-stone-900 selection:text-white font-sans">
      {/* 1. Sticky Floating Navbar */}
      <Navbar />

      <main>
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
  );
}
