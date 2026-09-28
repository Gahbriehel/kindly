"use client";

import Navbar from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Redefined } from "./components/Redefined";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { WhoItsFor } from "./components/WhoItsFor";
import { Pricing } from "./components/Pricing";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="relative font-sans antialiased bg-white dark:bg-gray-200 text-gray-900 dark:text-gray-100 selection:bg-[#FF9B7A]/30">
      <Navbar />
      <Hero />
      <Redefined />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
