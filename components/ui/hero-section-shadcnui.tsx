"use client";

import { motion, type Variants } from "framer-motion";
import { CloudUpload, Box, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const MARQUEE_MODELS: { name: string; logo: string; invert?: boolean }[] = [
  { name: "Claude", logo: "/provider-logos/anthropic.svg", invert: true },
  { name: "GPT-5.4", logo: "/provider-logos/openai.svg", invert: true },
  { name: "Gemini", logo: "/provider-logos/google.svg" },
  { name: "DeepSeek", logo: "/provider-logos/deepseek.svg", invert: true },
  { name: "Grok", logo: "/provider-logos/x.svg", invert: true },
  { name: "Doubao", logo: "/provider-logos/bytedance.svg" },
];

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full flex flex-col items-center px-4 pt-6 pb-4 text-center overflow-clip"
    >
      <motion.h1
        variants={itemVariants}
        className="mb-6 text-5xl tracking-tight md:text-7xl lg:text-8xl max-w-7xl leading-[1.05] font-[family-name:var(--font-display)]"
      >
        Save Up to{" "}
        <span className="relative inline-block" style={{ color: "var(--pink)" }}>
          65%
          <motion.div
            aria-hidden
            className="absolute left-0 -bottom-1 h-[3.5px] w-full rounded-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(209, 0, 118, 0.9), transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
          />
        </span>
        <br />
        on Top AI Models
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-8 max-w-3xl text-2xl md:text-3xl text-[var(--foreground)]/70"
      >
        One API to 50+ Top AI Models.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-5 md:gap-7"
      >
        <Feature icon={<CloudUpload className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />} label="One API" />
        <Feature icon={<Box className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />} label="50+ Models" />
        <Feature icon={<Zap className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />} label="Instant Access" />
      </motion.div>

      <motion.div variants={itemVariants} className="my-12">
        <Link
          href="https://console.service-inference.ai/signin"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white transition-all duration-200"
          style={{ background: "var(--pink)", boxShadow: "0 8px 24px var(--pink-glow)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 12px 30px var(--pink-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px var(--pink-glow)";
          }}
        >
          Get Started
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="w-full max-w-5xl flex items-center gap-5 px-2"
      >
        <span
          className="shrink-0 px-5 py-2.5 rounded-full text-[20px] font-bold tracking-[0.14em] uppercase text-white whitespace-nowrap"
          style={{
            background: "linear-gradient(90deg, #FF7A18, var(--pink))",
            boxShadow: "0 4px 16px var(--pink-glow)",
          }}
        >
          Top AI Models
        </span>
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, black, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, black, black 92%, transparent)",
          }}
        >
          <div
            className="flex items-center gap-[72px] py-[14px]"
            style={{ width: "max-content", animation: "marquee 28s linear infinite" }}
          >
            {[...MARQUEE_MODELS, ...MARQUEE_MODELS].map((m, i) => (
              <div key={i} className="flex items-center gap-3.5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.logo}
                  alt=""
                  className={`w-[36px] h-[36px] object-contain ${m.invert ? "logo-dark-invert" : ""}`}
                  loading="lazy"
                />
                <span
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: "var(--color-text)" }}
                >
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span style={{ color: "var(--pink)" }}>{icon}</span>
      <span
        className="text-sm md:text-base font-semibold tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        {label}
      </span>
    </div>
  );
}

