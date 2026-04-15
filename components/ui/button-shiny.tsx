import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

function ButtonCta({
  label = "Get Access",
  className,
  children,
  ...props
}: ButtonCtaProps) {
  return (
    <Button
      variant="ghost"
      className={cn("btn-shiny h-12 px-6", className)}
      {...props}
    >
      <span className="btn-shiny-label">{children ?? label}</span>
    </Button>
  );
}

export { ButtonCta };
