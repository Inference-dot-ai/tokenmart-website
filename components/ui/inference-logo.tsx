import * as React from "react";

export function InferenceLogo({
  className,
}: {
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tokenmart-cart.png"
      alt="TokenMart logo"
      className={className}
      draggable={false}
    />
  );
}
