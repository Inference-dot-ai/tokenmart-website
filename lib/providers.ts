// Provider registry — the single source of truth for brand name + logo.
//
// The public models endpoint carries no provider field, but the model id
// reliably encodes it (e.g. "claude-*" -> Anthropic). This maps id-prefix ->
// provider, and resolves a logo: a crisp local brand asset when we ship one,
// otherwise an automatic favicon-by-domain fallback so any *new* provider the
// endpoint adds still renders a mark without shipping a file first.
//
// Pure data (no React) so it can be imported by the build script too.

export type Provider = {
  key: string;
  name: string;
  domain: string;
  /** Local brand asset under /public; omit to fall back to the domain favicon. */
  logo?: string;
};

export const PROVIDERS: Provider[] = [
  { key: "anthropic", name: "Anthropic", domain: "anthropic.com", logo: "/tm-assets/claude-logo.png" },
  { key: "openai", name: "OpenAI", domain: "openai.com", logo: "/tm-assets/openai-logo.png" },
  { key: "google", name: "Google", domain: "google.com", logo: "/tm-assets/gemini-logo.png" },
  { key: "xai", name: "xAI", domain: "x.ai", logo: "/tm-assets/grok-logo.png" },
  { key: "deepseek", name: "DeepSeek", domain: "deepseek.com", logo: "/tm-assets/deepseek-logo.png" },
  { key: "alibaba", name: "Alibaba", domain: "alibabacloud.com", logo: "/tm-assets/qwen-logo.png" },
  { key: "moonshot", name: "Kimi AI", domain: "moonshot.cn", logo: "/tm-assets/kimi-logo.png" },
  { key: "zai", name: "Z.AI", domain: "z.ai", logo: "/tm-assets/zai-logo.png" },
  { key: "minimax", name: "MiniMax", domain: "minimaxi.com", logo: "/tm-assets/minimax-logo.png" },
  { key: "bytedance", name: "ByteDance", domain: "bytedance.com", logo: "/tm-assets/seedance-logo.png" },
];

const BY_KEY: Record<string, Provider> = Object.fromEntries(PROVIDERS.map((p) => [p.key, p]));

// Model-id prefix -> provider key. Order matters only for disjoint prefixes.
const ID_TO_PROVIDER: [RegExp, string][] = [
  [/^claude/i, "anthropic"],
  [/^gpt/i, "openai"],
  [/^gemini/i, "google"],
  [/^grok/i, "xai"],
  [/^deepseek/i, "deepseek"],
  [/^qwen/i, "alibaba"],
  [/^kimi/i, "moonshot"],
  [/^glm/i, "zai"],
  [/^minimax/i, "minimax"],
  [/seedance|dreamina/i, "bytedance"],
];

export function getProvider(key: string): Provider | undefined {
  return BY_KEY[key];
}

/** Resolve the provider for a raw endpoint model id, or undefined if unknown. */
export function providerForId(id: string): Provider | undefined {
  for (const [re, key] of ID_TO_PROVIDER) if (re.test(id)) return BY_KEY[key];
  return undefined;
}

/** Crisp local asset when present, else the provider's favicon (always resolves). */
export function providerLogo(p: Provider): string {
  return p.logo ?? `https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`;
}
