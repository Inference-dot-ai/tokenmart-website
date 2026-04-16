"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
      style={{
        background: "var(--color-surface-hi)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 3px var(--color-card-shadow)",
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun
        className="absolute w-4 h-4 transition-all duration-300"
        style={{
          color: theme === "light" ? "var(--pink)" : "var(--color-text-muted)",
          opacity: theme === "light" ? 1 : 0,
          transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
        }}
      />
      <Moon
        className="absolute w-4 h-4 transition-all duration-300"
        style={{
          color: theme === "dark" ? "var(--pink)" : "var(--color-text-muted)",
          opacity: theme === "dark" ? 1 : 0,
          transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
        }}
      />
    </button>
  );
}
