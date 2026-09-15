import { ButtonLink } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PageShell } from "@/components/site/PageShell";

export default function PostNotFound() {
  return (
    <PageShell>
      <Container className="flex min-h-[60dvh] flex-col items-start justify-center py-20">
        <p className="text-sm text-muted">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">That article is not here.</h1>
        <p className="mt-4 max-w-[48ch] text-lg text-muted">It may have moved, or the link may be mistyped.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/blog">Back to the blog</ButtonLink>
          <ButtonLink href="/models" variant="secondary">
            Browse models
          </ButtonLink>
        </div>
      </Container>
    </PageShell>
  );
}
