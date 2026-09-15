import { Container } from "@/components/site/Container";

const FACTS = [
  {
    title: "Official APIs, not look-alikes",
    body: "Requests go to the provider's own model. No quantized clones, no silent swaps.",
  },
  {
    title: "Pay per token",
    body: "No subscription, no seats and no minimum. You are billed for what you use.",
  },
  {
    title: "One key, every model",
    body: "Switch between Claude, GPT, Gemini and the rest by changing the model string.",
  },
  {
    title: "Rates you can check",
    body: "Every price on this site comes straight from the live TokenMart catalog.",
  },
];

export function WhyCheaper() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-ink md:text-[42px] md:leading-[1.08]">
            Why the same model costs less here.
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
            The discount comes from GPU-level inference optimization and buying at volume. The model you call is the
            model you get.
          </p>
        </div>
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7">
          {FACTS.map((f) => (
            <div key={f.title} className="border-t border-line-strong pt-5">
              <dt className="font-medium text-ink">{f.title}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{f.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
