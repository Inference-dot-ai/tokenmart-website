// One-off importer for a supplied batch of Markdown articles -> content/blog/*.mdx.
//
// The batch arrives as a JSON array of raw Markdown strings with no frontmatter,
// so every field the blog needs has to be derived here. This script is committed
// because a 100-file content diff cannot be reviewed by hand — the transforms
// below are the reviewable artifact.
//
//   node scripts/import-content-batch.mjs <input.json> [--out content/blog] [--dry]
//                                         [--date 2026-08-25] [--only 0,1,2]
//
// Transforms applied, in order:
//   1. Title  — "# X" or the generator's leaked "**H1 Title:** X" form.
//   2. Body   — the H1 is stripped. app/blog/[slug]/page.tsx renders <h1>{post.title}</h1>
//               itself, so leaving it in the body produces two H1s on the page.
//   3. FAQ    — the "## Frequently Asked Questions" section is lifted into the `faq`
//               frontmatter and REMOVED from the body. The page renders FAQ from
//               frontmatter and emits FAQPage JSON-LD from it; leaving the section in
//               the body would render it twice. Two question formats occur in the
//               batch: "### Q" and bold "**Q**".
//   4. Domain — https://thetokenmart.ai -> https://thetokenmart.com. The .ai domain is
//               abandoned (see PR #13); shipping these unfixed would reintroduce it 224x.
//   5. Brand  — "Thetokenmart" / "thetokenmart" / "TheTokenMart" -> "TokenMart", without
//               touching URLs.
//   6. Frontmatter — description from the opening prose, tags from the detected topic,
//               cover/og image assigned deterministically from the existing image pool.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { applyFixes, TITLE_OVERRIDES } from "./content-fixes.mjs";

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const DRY = args.includes("--dry");
const OUT = flag("out", "content/blog");
const DATE = flag("date", "2026-08-25");
const ONLY = flag("only", null);

if (!input) {
  console.error("usage: node scripts/import-content-batch.mjs <input.json> [--out DIR] [--dry] [--date YYYY-MM-DD] [--only 1,2,3]");
  process.exit(1);
}

const CANONICAL_HOST = "https://thetokenmart.com";
const DEAD_HOST_RE = /https?:\/\/(?:www\.)?thetokenmart\.ai/gi;

// ---------------------------------------------------------------- title / slug

function extractTitle(md) {
  const h1 = md.match(/^#\s+(.+)$/m);
  if (h1) return { title: h1[1].trim(), raw: h1[0], leaked: false };
  // The generator left its own scaffolding in at least one article.
  const leak = md.match(/^\*\*H1 Title:\*\*\s*(.+)$/m);
  if (leak) return { title: leak[1].trim(), raw: leak[0], leaked: true };
  return null;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

// ------------------------------------------------------------------- cleaning

/** Rewrite the dead domain, then normalise the brand without corrupting URLs. */
function cleanText(text) {
  let out = text.replace(DEAD_HOST_RE, CANONICAL_HOST);

  // Mask URLs so the brand pass can't rewrite the host inside them.
  const urls = [];
  out = out.replace(/https?:\/\/[^\s)\]]+/g, (m) => {
    urls.push(m);
    return `⟦URL${urls.length - 1}⟧`;
  });

  out = out
    .replace(/\bTheTokenMart\b/g, "TokenMart")
    .replace(/\bThetokenmart\b/g, "TokenMart")
    .replace(/\bthetokenmart\b/g, "TokenMart");

  return out.replace(/⟦URL(\d+)⟧/g, (_, i) => urls[Number(i)]);
}

/**
 * FAQ text is rendered as a plain React string (`<dd>{item.a}</dd>`) and is emitted
 * verbatim into FAQPage JSON-LD, so Markdown must be flattened here or the asterisks
 * show up literally on the page and in structured data.
 */
function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\w)\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// ------------------------------------------------------------------------ FAQ

/**
 * Pull the FAQ section out of the body. Returns { faq, body }.
 * The section runs from "## Frequently Asked Questions" to the next "## ".
 */
function extractFaq(md) {
  const re = /^##\s+Frequently Asked Questions\s*\n([\s\S]*?)(?=^##\s|\Z)/m;
  const m = md.match(re);
  if (!m) return { faq: [], body: md };

  const section = m[1];
  const faq = [];

  // Format A: "### Question" followed by the answer paragraph(s).
  const hashRe = /^###\s+(.+?)\s*\n+([\s\S]*?)(?=^###\s|\Z)/gm;
  let hit;
  while ((hit = hashRe.exec(section))) {
    faq.push({ q: hit[1].trim(), a: hit[2].trim().replace(/\s*\n+\s*/g, " ") });
  }

  // Format B: bold "**Question**" on its own line, answer beneath.
  if (faq.length === 0) {
    const boldRe = /^\*\*(.+?)\*\*\s*\n+([\s\S]*?)(?=^\*\*|\Z)/gm;
    while ((hit = boldRe.exec(section))) {
      faq.push({ q: hit[1].trim(), a: hit[2].trim().replace(/\s*\n+\s*/g, " ") });
    }
  }

  const body = md.replace(re, "");
  return { faq, body };
}

// ---------------------------------------------------------------- description

/** First substantial prose paragraph, used as the meta description. */
function extractDescription(body) {
  const paras = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p &&
        !p.startsWith("#") &&
        !p.startsWith("*") &&
        !p.startsWith("-") &&
        !p.startsWith(">") &&
        !/^\*\*(TL;DR|H1 Title)/i.test(p) &&
        p.length > 120,
    );
  if (!paras.length) return null;

  const plain = stripMarkdown(paras[0]);

  if (plain.length <= 300) return plain;
  // Trim to the last sentence boundary that fits.
  const cut = plain.slice(0, 300);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  return (stop > 150 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, "")).trim();
}

// ----------------------------------------------------------- topic -> tags/art

const TOPIC_RULES = [
  [/\bgemini\b|\bgoogle\b/i, "gemini"],
  [/\bclaude\b|\banthropic\b/i, "claude"],
  [/\bgrok\b|\bxai\b/i, "grok"],
  [/\bdeepseek\b/i, "deepseek"],
  [/\bopenai\b|\bchatgpt\b|\bchat gpt\b|\bgpt\b|\bopen ai\b/i, "openai"],
];

function detectTopic(title) {
  for (const [re, topic] of TOPIC_RULES) if (re.test(title)) return topic;
  return "llm";
}

function detectTags(title) {
  const tags = ["pricing"];
  if (/\bvs\b|comparison|alternative/i.test(title)) tags.push("model-comparison");
  if (/cost|spend|budget|save|saving|reduce|optimi[sz]/i.test(title)) tags.push("costs");
  if (/guide|how to|complete|best practice/i.test(title)) tags.push("playbook");
  return [...new Set(tags)].slice(0, 3);
}

/** Deterministic cover assignment from whatever is already in public/blog/covers. */
function buildCoverPool(root) {
  const dir = join(root, "public/blog/covers");
  const ogDir = join(root, "public/blog/og");
  if (!existsSync(dir) || !existsSync(ogDir)) return [];
  const og = new Set(readdirSync(ogDir));
  return readdirSync(dir)
    .filter((f) => f.endsWith(".jpg") && og.has(f))
    // Money / chart / warehouse imagery suits pricing content; keep the
    // article-specific covers (named after an existing post) out of the pool.
    .filter((f) => /^(money|chart|warehouse|abstract|ai|code|keyboard|server|art|audio)-/.test(f))
    .sort();
}

// ---------------------------------------------------------------- frontmatter

const yamlStr = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function frontmatter({ title, description, date, tags, cover }) {
  const lines = [
    "---",
    `title: ${yamlStr(title)}`,
    `description: ${yamlStr(description)}`,
    `publishedAt: ${date}`,
    `updatedAt: ${date}`,
    `author: "client"`,
    `tags: [${tags.map(yamlStr).join(", ")}]`,
    `coverImage: ${yamlStr(`/blog/covers/${cover}`)}`,
    `ogImage: ${yamlStr(`/blog/og/${cover}`)}`,
  ];
  return lines;
}

function faqYaml(faq) {
  if (!faq.length) return [];
  const out = ["faq:"];
  for (const { q, a } of faq) {
    out.push(`  - q: ${yamlStr(q)}`);
    out.push(`    a: ${yamlStr(a)}`);
  }
  return out;
}

// ----------------------------------------------------------------------- main

const root = process.cwd();
const raw = JSON.parse(readFileSync(input, "utf8"));
if (!Array.isArray(raw)) throw new Error("expected a JSON array of Markdown strings");

const only = ONLY ? new Set(ONLY.split(",").map((n) => Number(n.trim()))) : null;
const covers = buildCoverPool(root);
if (!covers.length) throw new Error("no cover images found under public/blog/{covers,og}");

// Optional review-pass edits: { files: [{ file, edits: [{ find, replace, reason, kind }] }] }
// Applied verbatim after generation. Anything whose `find` is absent or
// ambiguous is reported rather than silently skipped — a near-miss edit means
// the intended correction did NOT land.
const EDITS_PATH = flag("edits", null);
const editsByFile = new Map();
if (EDITS_PATH) {
  const parsed = JSON.parse(readFileSync(EDITS_PATH, "utf8"));
  for (const f of parsed.files || []) {
    if (f.edits?.length) editsByFile.set(f.file, f.edits);
  }
}
const editStats = { applied: 0, notFound: [], ambiguous: [] };

const editFilesSeen = new Set();

function applyEdits(text, file) {
  const edits = editsByFile.get(file);
  if (!edits) return text;
  editFilesSeen.add(file);
  let out = text;
  for (const e of edits) {
    const first = out.indexOf(e.find);
    if (first === -1) {
      editStats.notFound.push({ file, kind: e.kind, find: e.find.slice(0, 70) });
      continue;
    }
    if (out.indexOf(e.find, first + 1) !== -1) {
      editStats.ambiguous.push({ file, kind: e.kind, find: e.find.slice(0, 70) });
      continue;
    }
    out = out.slice(0, first) + e.replace + out.slice(first + e.find.length);
    editStats.applied += 1;
  }
  return out;
}

// Slugs already taken by posts this run did NOT produce. Re-running the importer
// must overwrite its own previous output rather than treat it as a collision —
// otherwise every article picks up a "-2" suffix on the second run.
const ownSlugs = new Set();
raw.forEach((md, index) => {
  if (only && !only.has(index)) return;
  const t = extractTitle(md);
  if (!t) return;
  const title = TITLE_OVERRIDES[index] ?? t.title;
  const s = slugify(cleanText(title));
  if (s) ownSlugs.add(s);
});

const existing = existsSync(OUT)
  ? new Set(
      readdirSync(OUT)
        .filter((f) => /\.mdx?$/.test(f))
        .map((f) => basename(f).replace(/\.mdx?$/, ""))
        .filter((s) => !ownSlugs.has(s)),
    )
  : new Set();

const seen = new Set(existing);
const report = [];
const skipped = [];

raw.forEach((rawMd, index) => {
  if (only && !only.has(index)) return;

  // Brand normalisation must precede applyFixes: the discount-capping pass only
  // rewrites sentences that name us, and "Thetokenmart" does not match that.
  const md = applyFixes(cleanText(rawMd));

  const t = extractTitle(md);
  if (!t) {
    skipped.push({ index, reason: "no H1 could be extracted" });
    return;
  }

  if (TITLE_OVERRIDES[index]) t.title = TITLE_OVERRIDES[index];

  let slug = slugify(t.title);
  if (!slug) {
    skipped.push({ index, reason: "title produced an empty slug" });
    return;
  }
  const collidedWith = seen.has(slug) ? slug : null;
  if (collidedWith) {
    let n = 2;
    while (seen.has(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }
  seen.add(slug);

  // Strip the H1 (the page renders the title itself).
  let body = md.replace(t.raw, "").trimStart();
  // Normalise the leaked bold TL;DR heading to a real heading.
  body = body.replace(/^\*\*TL;DR\s*\/\s*Key Takeaways\*\*/m, "## TL;DR / Key Takeaways");

  const { faq, body: bodyNoFaq } = extractFaq(body);
  const cleanedBody = cleanText(bodyNoFaq).replace(/\n{3,}/g, "\n\n").trim();
  const description = extractDescription(cleanedBody);
  if (!description) {
    skipped.push({ index, reason: "no paragraph long enough for a description" });
    return;
  }

  const title = cleanText(t.title);
  const cover = covers[index % covers.length];
  const tags = detectTags(title);

  const fm = [
    ...frontmatter({ title, description, date: DATE, tags, cover }),
    ...faqYaml(faq.map((f) => ({ q: stripMarkdown(cleanText(f.q)), a: stripMarkdown(cleanText(f.a)) }))),
    "---",
    "",
  ];

  const filename = `${slug}.mdx`;
  const out = applyEdits(`${fm.join("\n")}\n${cleanedBody}\n`, filename);
  const file = join(OUT, filename);

  if (!DRY) writeFileSync(file, out, "utf8");

  report.push({
    index,
    slug,
    title,
    topic: detectTopic(title),
    tags,
    faqCount: faq.length,
    words: cleanedBody.split(/\s+/).length,
    descriptionChars: description.length,
    titleLeak: t.leaked,
    collidedWith,
  });
});

// -------------------------------------------------------------------- summary

console.log(`${DRY ? "[dry run] " : ""}wrote ${report.length} of ${raw.length} articles to ${OUT}`);
if (skipped.length) {
  console.log(`\nSKIPPED ${skipped.length}:`);
  for (const s of skipped) console.log(`  #${s.index}: ${s.reason}`);
}
const leaks = report.filter((r) => r.titleLeak);
if (leaks.length) console.log(`\nTitle recovered from leaked scaffolding: ${leaks.map((r) => `#${r.index}`).join(", ")}`);
const coll = report.filter((r) => r.collidedWith);
if (coll.length) {
  console.log(`\nSlug collisions resolved with a numeric suffix:`);
  for (const c of coll) console.log(`  #${c.index}: ${c.collidedWith} -> ${c.slug}`);
}
const noFaq = report.filter((r) => r.faqCount === 0);
if (noFaq.length) console.log(`\nNo FAQ extracted: ${noFaq.map((r) => `#${r.index}`).join(", ")}`);

if (EDITS_PATH) {
  console.log(`\nReview edits: ${editStats.applied} applied`);
  if (editStats.notFound.length) {
    console.log(`  ${editStats.notFound.length} NOT APPLIED (find text absent):`);
    for (const e of editStats.notFound.slice(0, 20)) console.log(`    ${e.file} [${e.kind}] ${JSON.stringify(e.find)}`);
    if (editStats.notFound.length > 20) console.log(`    ... and ${editStats.notFound.length - 20} more`);
  }
  const orphaned = [...editsByFile.keys()].filter((f) => !editFilesSeen.has(f));
  if (orphaned.length) {
    console.log(`  ${orphaned.length} edit GROUPS targeted a file that was never generated:`);
    for (const f of orphaned) console.log(`    ${f} (${editsByFile.get(f).length} edits skipped)`);
  }
  if (editStats.ambiguous.length) {
    console.log(`  ${editStats.ambiguous.length} NOT APPLIED (find text not unique):`);
    for (const e of editStats.ambiguous.slice(0, 20)) console.log(`    ${e.file} [${e.kind}] ${JSON.stringify(e.find)}`);
  }
}

const byTopic = report.reduce((acc, r) => ((acc[r.topic] = (acc[r.topic] || 0) + 1), acc), {});
console.log(`\nTopics: ${JSON.stringify(byTopic)}`);
console.log(`Words: min ${Math.min(...report.map((r) => r.words))} / max ${Math.max(...report.map((r) => r.words))}`);

const reportPath = flag("report", null);
if (reportPath) {
  writeFileSync(reportPath, JSON.stringify({ date: DATE, written: report, skipped }, null, 2));
  console.log(`\nPer-article report written to ${reportPath}`);
}
