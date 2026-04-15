import * as React from "react";

export function InferenceLogo({
  className,
  color = "var(--pink)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Inference.ai logo"
    >
      <circle cx="24" cy="24" r="19" />
      <ellipse cx="24" cy="24" rx="19" ry="8" />
      <ellipse
        cx="24"
        cy="24"
        rx="19"
        ry="8"
        transform="rotate(60 24 24)"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="19"
        ry="8"
        transform="rotate(-60 24 24)"
      />
      <circle cx="24" cy="24" r="2.2" fill={color} stroke="none" />
    </svg>
  );
}
