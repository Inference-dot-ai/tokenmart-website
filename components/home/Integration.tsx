"use client";

import { useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { Container } from "@/components/site/Container";
import { flagshipOf } from "@/lib/catalog-select";
import { API_BASE_URL } from "@/lib/site";

// Recipes mirror drr400000's connect registry (src/shared/connect-registry.ts):
// OpenAI-style clients take the /v1 base, Anthropic clients take the bare host.
function snippets(openaiModel: string, claudeModel: string) {
  return [
    {
      id: "openai-py",
      label: "OpenAI SDK",
      lang: "python",
      code: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_TOKENMART_KEY",
    base_url="${API_BASE_URL}/v1",
)

reply = client.chat.completions.create(
    model="${openaiModel}",
    messages=[{"role": "user", "content": "Hello"}],
)`,
    },
    {
      id: "anthropic-ts",
      label: "Anthropic SDK",
      lang: "typescript",
      code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "YOUR_TOKENMART_KEY",
  baseURL: "${API_BASE_URL}",
});

const reply = await client.messages.create({
  model: "${claudeModel}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});`,
    },
    {
      id: "claude-code",
      label: "Claude Code",
      lang: "bash",
      code: `export ANTHROPIC_BASE_URL=${API_BASE_URL}
export ANTHROPIC_AUTH_TOKEN=YOUR_TOKENMART_KEY
export ANTHROPIC_MODEL=${claudeModel}
claude`,
    },
    {
      id: "curl",
      label: "cURL",
      lang: "bash",
      code: `curl ${API_BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_TOKENMART_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${openaiModel}", "messages": [{"role": "user", "content": "Hello"}]}'`,
    },
  ];
}

export function Integration() {
  const { catalog } = useCatalog();
  const openaiModel = flagshipOf(catalog.models, "openai", "text")?.id ?? "gpt-5.5";
  const claudeModel = flagshipOf(catalog.models, "anthropic", "text")?.id ?? "claude-sonnet-5";
  const list = snippets(openaiModel, claudeModel);

  const baseId = useId();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = list[active];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked; the code stays selectable
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-ink md:text-[42px] md:leading-[1.08]">
            Change the base URL. Keep your code.
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">
            TokenMart speaks the OpenAI, Anthropic and Gemini APIs, so the SDKs and tools you already use work as they
            are.
          </p>
        </div>

        <div className="min-w-0 lg:col-span-8">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#0d0d11] shadow-lift">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pr-2">
              <div role="tablist" aria-label="Integration examples" className="flex overflow-x-auto">
                {list.map((s, i) => (
                  <button
                    key={s.id}
                    role="tab"
                    id={`${baseId}-${s.id}`}
                    aria-selected={i === active}
                    aria-controls={`${baseId}-code`}
                    onClick={() => {
                      setActive(i);
                      setCopied(false);
                    }}
                    className={`shrink-0 border-b-2 px-4 py-3 text-sm transition-colors ${
                      i === active ? "border-[#ff5a9d] text-white" : "border-transparent text-white/55 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Copied" : "Copy code"}
                className="grid size-8 shrink-0 place-items-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check size={16} strokeWidth={1.75} /> : <Copy size={16} strokeWidth={1.75} />}
              </button>
            </div>
            <pre
              id={`${baseId}-code`}
              role="tabpanel"
              aria-labelledby={`${baseId}-${current.id}`}
              className="overflow-x-auto p-5 text-[13px] leading-relaxed text-[#e6e6ea] sm:p-6 sm:text-sm"
            >
              <code className="font-mono">{current.code}</code>
            </pre>
          </div>
        </div>
      </Container>
    </section>
  );
}
