// Inserts a new sponsor (parsed from a GitHub issue form) at the top of
// src/sponsors.json, dated today. Run by .github/workflows/sponsor-pr.yml.
//
// Input: ISSUE_PAYLOAD env var — the JSON string emitted by
// stefanbuck/github-issue-parser, keyed by the form field ids
// (name, link, message, tier). Empty optional fields arrive as "_No response_".
//
// Validates, drops empty/optional fields, and refuses anything malformed so a
// bad issue fails the run rather than writing junk. On success it appends a
// `title` to $GITHUB_OUTPUT for the PR title.

import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const JSON_PATH = new URL("../src/sponsors.json", import.meta.url);
const TIERS = new Set(["coffee", "meal", "rocket"]);

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

// "_No response_" is what the issue parser emits for an empty optional field.
const clean = (v) => {
  if (typeof v !== "string") return "";
  const t = v.trim();
  return t === "_No response_" || t === "(none)" ? "" : t;
};

const payload = process.env.ISSUE_PAYLOAD;
if (!payload) fail("ISSUE_PAYLOAD env var is empty.");

let fields;
try {
  fields = JSON.parse(payload);
} catch {
  fail("ISSUE_PAYLOAD is not valid JSON.");
}

const name = clean(fields.name);
const link = clean(fields.link);
// A textarea can contain newlines; collapse to a single line for the wall.
const message = clean(fields.message).replace(/\s+/g, " ");
// The dropdown options carry a friendly emoji (e.g. "☕ coffee"); keep only the
// known keyword so the form's labels can change without touching this script.
const tierRaw = clean(fields.tier);
const tier = tierRaw
  ? ([...TIERS].find((t) => tierRaw.includes(t)) ?? tierRaw)
  : "";

// --- validation -----------------------------------------------------------
if (!name) fail("Name is required.");
if (name.length > 60) fail("Name is too long (max 60 chars).");
// No control chars / newlines in name: it's echoed into $GITHUB_OUTPUT, where
// a newline would let a crafted issue inject extra workflow outputs.
if (/[\x00-\x1f\x7f]/.test(name)) fail("Name has control characters.");

if (link && !/^https:\/\/\S+$/.test(link)) {
  fail(`Link must be a single https:// URL, got: ${link}`);
}

if (message.length > 140) fail("Message is too long (max 140 chars).");
if (/[<>]/.test(message) || /[<>]/.test(name)) {
  fail("Name/message may not contain < or >.");
}

if (tier && !TIERS.has(tier)) fail(`Unknown tier: ${tier}`);

// --- build the entry (key order matches the existing file) -----------------
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
const entry = { name };
if (tier) entry.tier = tier;
if (link) entry.link = link;
if (message) entry.message = message;
entry.date = today;

// --- splice in at the top (file is newest-first) ---------------------------
const data = JSON.parse(readFileSync(JSON_PATH, "utf8"));
if (!Array.isArray(data.sponsors)) fail("sponsors.json has no sponsors array.");
data.sponsors.unshift(entry);

// 2-space indent + trailing newline matches Prettier's JSON output.
writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ Added sponsor "${name}" dated ${today}.`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `title=chore: add sponsor ${name}\n`,
  );
}
