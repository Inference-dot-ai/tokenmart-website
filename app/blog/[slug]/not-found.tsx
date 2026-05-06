import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function PostNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <header className="flex justify-center pt-4">
        <Navbar fixed={false} />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p
          className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3"
          style={{ color: "var(--pink)" }}
        >
          404 · Post not found
        </p>
        <h1
          className="text-3xl md:text-4xl font-[family-name:var(--font-display)] tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          That story isn&apos;t here.
        </h1>
        <p
          className="mt-3 max-w-md leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          The post you&apos;re looking for might have been moved or never existed.
        </p>
        <Link
          href="/blog"
          className="mt-7 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium"
          style={{ background: "var(--pink)", color: "white" }}
        >
          Back to the blog
        </Link>
      </main>
      <Footer />
    </div>
  );
}
