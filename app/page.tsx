"use client";

import { TMHeader } from "@/components/tm/Header";
import { DealTicker } from "@/components/tm/DealTicker";
import { Hero } from "@/components/tm/Hero";
import { Marketplace } from "@/components/tm/Marketplace";
import { HowItWorks } from "@/components/tm/HowItWorks";
import { Benefits } from "@/components/tm/Benefits";
import { PricingCompare } from "@/components/tm/PricingCompare";
import { FinalCTA } from "@/components/tm/FinalCTA";
import { TMFooter } from "@/components/tm/Footer";
import { useGetuHref } from "@/lib/attribution";

const MODELS_HREF = "https://console.service-inference.ai/models";

export default function Home() {
  const apiHref = useGetuHref(MODELS_HREF);

  return (
    <div className="tm-root bg-grid finish-glossy density-medium">
      <TMHeader />
      <DealTicker />
      <main>
        <Hero />
        <Marketplace apiHref={apiHref} />
        <HowItWorks />
        <Benefits />
        <PricingCompare />
        <FinalCTA />
      </main>
      <TMFooter />
    </div>
  );
}
