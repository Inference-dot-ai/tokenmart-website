"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Code } from "lucide-react";
import Link from "next/link";
import { FloatingModelCards } from "@/components/ui/floating-model-cards";

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
      className="relative w-full flex min-h-[calc(70vh-6rem)] flex-col items-center justify-center px-4 py-10 text-center overflow-clip"
    >
      <FloatingModelCards />
      <motion.h1
        variants={itemVariants}
        className="mb-6 text-5xl tracking-tight md:text-7xl lg:text-8xl max-w-7xl leading-[1.05] font-[family-name:var(--font-display)]"
      >
        Get Up to{" "}
        <span className="relative inline-block">
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
        </span>{" "}
        off
        <br />
        AI Models
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-6 max-w-2xl text-lg text-[var(--foreground)]/70"
      >
        Access top multimodal AI for chat, image, and video. Run top models at prices lower than Fal.ai, with 99.9% reliability for production workloads.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/models"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200"
          style={{
            background: "transparent",
            border: "1.5px solid var(--pink)",
            color: "var(--pink)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--pink-lo)";
            e.currentTarget.style.boxShadow = "0 8px 24px var(--pink-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Code className="h-4 w-4" strokeWidth={2.5} />
          <span className="font-[family-name:var(--font-mono)] text-base font-semibold tracking-tight">
            Explore Models
          </span>
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </Link>
        <Link
          href="/api"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 transition-all duration-200"
          style={{
            border: "1.5px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-text)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--pink)";
            e.currentTarget.style.color = "var(--pink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text)";
          }}
        >
          <span className="font-[family-name:var(--font-mono)] text-base font-medium tracking-tight">
            View API Docs
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
