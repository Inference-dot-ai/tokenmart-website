import Link from "next/link";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export const blogMdxComponents: MDXComponents = {
  a: ({ href = "#", children, ...rest }: ComponentProps<"a">) => {
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
