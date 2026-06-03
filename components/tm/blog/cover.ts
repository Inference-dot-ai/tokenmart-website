// Deterministic gradient-mesh cover (matches the prototype's generated blog art).
// Used as a fallback when a post has no coverImage so cards/heroes never blank out.
const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ["#ffb3d9", "#c9b3ff"],
  ["#a7e8ff", "#b3c7ff"],
  ["#cdb3ff", "#ffc2e8"],
  ["#d6ff9e", "#9ee8c4"],
  ["#ffd59e", "#ffb3b3"],
  ["#b3e0ff", "#c4b3ff"],
];

const GLYPHS = ["✳", "◍", "◗", "▦", "⌗", "⚙", "✦", "◆", "◈", "◇", "►", "∞"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function coverFor(slug: string): { c1: string; c2: string; glyph: string } {
  const h = hash(slug);
  const [c1, c2] = PALETTE[h % PALETTE.length];
  const glyph = GLYPHS[(h >> 3) % GLYPHS.length];
  return { c1, c2, glyph };
}

export function meshBackground(c1: string, c2: string): string {
  return (
    `radial-gradient(115% 130% at 16% 12%, ${c1}, transparent 56%),` +
    `radial-gradient(120% 120% at 88% 86%, ${c2}, transparent 54%),` +
    `radial-gradient(90% 90% at 60% 40%, ${c1}66, transparent 60%),` +
    `linear-gradient(135deg, ${c1}33, ${c2}33)`
  );
}
