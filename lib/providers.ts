// Provider registry: the single source of truth for brand name, logo and art.
//
// The public models endpoint carries no provider field, but the model id
// reliably encodes it (e.g. "claude-*" -> Anthropic). This maps id patterns to
// a provider and resolves a logo: a local brand asset when we ship one,
// otherwise a favicon-by-domain fallback so a *new* provider the endpoint adds
// still renders a mark without shipping a file first.
//
// Pure data (no React) so build scripts and the Pages Function can import it.

export type Provider = {
  key: string;
  name: string;
  domain: string;
  /** Local brand asset under /public; omit to fall back to the domain favicon. */
  logo?: string;
  /** Commissioned artwork under /public/art, used on deal tiles. */
  art?: string;
};

export const PROVIDERS: Provider[] = [
  { key: "anthropic", name: "Anthropic", domain: "anthropic.com", logo: "/tm-assets/claude-logo.png", art: "/art/anthropic.webp" },
  { key: "openai", name: "OpenAI", domain: "openai.com", logo: "/tm-assets/openai-logo.png", art: "/art/openai.webp" },
  { key: "google", name: "Google", domain: "google.com", logo: "/tm-assets/gemini-logo.png", art: "/art/google.webp" },
  { key: "xai", name: "xAI", domain: "x.ai", logo: "/tm-assets/grok-logo.png", art: "/art/xai.webp" },
  { key: "deepseek", name: "DeepSeek", domain: "deepseek.com", logo: "/tm-assets/deepseek-logo.png", art: "/art/deepseek.webp" },
  { key: "alibaba", name: "Alibaba Qwen", domain: "alibabacloud.com", logo: "/tm-assets/qwen-logo.png", art: "/art/alibaba.webp" },
  { key: "moonshot", name: "Moonshot Kimi", domain: "moonshot.cn", logo: "/tm-assets/kimi-logo.png", art: "/art/moonshot.webp" },
  { key: "zai", name: "Z.AI", domain: "z.ai", logo: "/tm-assets/zai-logo.png", art: "/art/zai.webp" },
  { key: "minimax", name: "MiniMax", domain: "minimaxi.com", logo: "/tm-assets/minimax-logo.png", art: "/art/minimax.webp" },
  { key: "bytedance", name: "ByteDance Seed", domain: "bytedance.com", logo: "/tm-assets/seedance-logo.png", art: "/art/bytedance.webp" },
];

const BY_KEY: Record<string, Provider> = Object.fromEntries(PROVIDERS.map((p) => [p.key, p]));

/** Order of provider groups on the site (registry order). */
export const PROVIDER_ORDER: string[] = PROVIDERS.map((p) => p.key);

// Model-id pattern -> provider key. First match wins.
const ID_TO_PROVIDER: [RegExp, string][] = [
  [/^claude/i, "anthropic"],
  [/^gpt|^o\d/i, "openai"],
  [/^gemini/i, "google"],
  [/^grok/i, "xai"],
  [/^deepseek/i, "deepseek"],
  [/^qwen/i, "alibaba"],
  [/^kimi/i, "moonshot"],
  [/^glm/i, "zai"],
  [/^minimax/i, "minimax"],
  [/seedance|seedream|dreamina|doubao|^dola-/i, "bytedance"],
];

export function getProvider(key: string): Provider | undefined {
  return BY_KEY[key];
}

/** Resolve the provider for a raw endpoint model id, or undefined if unknown. */
export function providerForId(id: string): Provider | undefined {
  for (const [re, key] of ID_TO_PROVIDER) if (re.test(id)) return BY_KEY[key];
  return undefined;
}

/** Local asset when present, else the provider's favicon (always resolves). */
export function providerLogo(p: Provider): string {
  return p.logo ?? `https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`;
}
