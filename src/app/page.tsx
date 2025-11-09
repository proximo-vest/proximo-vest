import CTABanner from "@/components/landing-page/cta-banner";
import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import { Navbar } from "@/components/landing-page/navbar";
import Pricing from "@/components/landing-page/pricing";
import Testimonials from "@/components/landing-page/testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
        <Testimonials />
        <CTABanner />
        <Footer />
      </main>
    </>
  );
}