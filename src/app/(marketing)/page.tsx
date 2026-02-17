"use client";

import Navbar from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProblemSolution } from "./components/ProblemSolution";
import { HowItWorks } from "./components/HowItWorks";
import { TargetAudience } from "./components/TargetAudience";
import { VsComparison } from "./components/VsComparison";
import { Features } from "./components/Features";
import { Pricing } from "./components/Pricing";
import { TrustPrivacy } from "./components/TrustPrivacy";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="relative font-sans antialiased text-gray-900 bg-white dark:bg-gray-950 dark:text-gray-100 selection:bg-[#FF9B7A]/30">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <TargetAudience />
      <VsComparison />
      <Features />
      <Pricing />
      <TrustPrivacy />
      <CTA />
      <Footer />
    </div>
  );
}
