"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
      className="flex min-h-[500px] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <motion.h1
        variants={itemVariants}
        className="mb-6 text-4xl font-bold tracking-tight md:text-6xl max-w-4xl"
      >
        Access Popular AI Models at{" "}
        <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          up to 60% Lower Cost
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-8 max-w-2xl text-lg text-[var(--foreground)]/70"
      >
        Get the same models you&apos;re using now, but cheaper. Powered by
        optimized GPU pooling and intelligent workload orchestration.
      </motion.p>

      <motion.div variants={itemVariants} className="flex justify-center gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-white text-lg font-normal px-6 py-3 rounded-full transition-all duration-200"
          style={{ background: "var(--pink)" }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 24px var(--pink-glow)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          Get Started
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </a>
        <button
          className="group relative overflow-hidden inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-xl px-6 py-3 text-lg font-normal text-white transition-all hover:bg-white/10 hover:border-white/30"
        >
          <span className="relative z-10">View Demo</span>
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-12 flex items-center gap-8 text-sm text-[var(--foreground)]/60"
      >
        <div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            10k+
          </div>
          <div>Downloads</div>
        </div>
        <div className="h-8 w-px bg-[var(--border)]" />
        <div>
          <div className="text-2xl font-bold text-[var(--foreground)]">50+</div>
          <div>Components</div>
        </div>
        <div className="h-8 w-px bg-[var(--border)]" />
        <div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            100%
          </div>
          <div>Open Source</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
