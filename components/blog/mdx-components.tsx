import Link from "next/link";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { BlogSignupLink } from "@/components/blog/BlogSignupLink";

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function isTokenMartConsole(href: string): boolean {
  return /^https?:\/\/console\.service-inference\.ai(\/|$)/i.test(href);
}

export const blogMdxComponents: MDXComponents = {
  a: ({ href = "#", children, ...rest }: ComponentProps<"a">) => {
    if (isTokenMartConsole(href)) {
      return <BlogSignupLink href={href}>{children}</BlogSignupLink>;
    }
    if (isExternal(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--pink)" }}
          className="underline underline-offset-4 decoration-1 hover:decoration-2"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        style={{ color: "var(--pink)" }}
        className="underline underline-offset-4 decoration-1 hover:decoration-2"
      >
        {children}
      </Link>
    );
  },
};
