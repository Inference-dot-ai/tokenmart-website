import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:brightness-[1.06] shadow-[0_1px_0_rgb(255_255_255/0.2)_inset]",
  secondary: "bg-surface text-ink border border-line-strong hover:border-ink/40",
  ghost: "text-ink hover:bg-surface-2",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,filter,background-color,border-color] duration-200 active:scale-[0.98] ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
}) {
  const cls = buttonClass(variant, size, className);
  if (/^(https?:|mailto:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
