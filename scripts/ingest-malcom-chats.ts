#!/usr/bin/env tsx
/**
 * BRE-145 — Optional Malcolm chat ingestion + scrubbing.
 *
 * Run this FROM A HOST THAT CAN REACH MALCOM (the Mac Malcolm runs on, or a
 * machine on the same Tailnet). opencode cannot reach Malcolm from this
 * environment, so this script is intentionally opt-in and offline: it reads
 * exported chat log files from a local directory, scrubs obvious secrets,
 * and writes a scrubbed chunk index. It does NOT embed by default — no
 * embeddings dependency is added. See the handoff doc for wiring guidance.
 *
 * ALWAYS review the scrubbed output before exposing it to a model.
 *
 * Usage:
 *   tsx scripts/ingest-malcom-chats.ts --input <exported-chats-dir> --output .private/malcom-index.jsonl
 *
 * Export your chat logs (from Malcolm's session registry / logs) as plain text
 * or markdown files into a directory, then point --input at that directory.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

interface Args {
  input: string;
  output: string;
  chunkSize: number;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { input: "", output: "", chunkSize: 1200 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--input") args.input = argv[++i];
    else if (a === "--output") args.output = argv[++i];
    else if (a === "--chunk-size") args.chunkSize = Number(argv[++i]) || 1200;
    else if (a === "-h" || a === "--help") {
      console.log("Usage: tsx scripts/ingest-malcom-chats.ts --input <dir> --output <file.jsonl> [--chunk-size N]");
      process.exit(0);
    }
  }
  if (!args.input || !args.output) {
    console.error("Error: --input and --output are required");
    process.exit(1);
  }
  return args;
}

const SCRUB_PATTERNS: { name: string; re: RegExp; replacement: string }[] = [
  { name: "bearer/token", re: /\b(sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{16,}|[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{24,})\b/g, replacement: "[REDACTED_TOKEN]" },
  { name: "api-key", re: /\b(api[_-]?key["'\s:=]+["']?[A-Za-z0-9_-]{16,})\b/gi, replacement: "[REDACTED_API_KEY]" },
  { name: "password", re: /\b(password|passwd|pwd)["'\s:=]+["']?[^\s"']{4,}/gi, replacement: "[REDACTED_PASSWORD]" },
  { name: "email", re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: "[REDACTED_EMAIL]" },
  { name: "phone", re: /\b(\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, replacement: "[REDACTED_PHONE]" },
  { name: "credit-card", re: /\b(?:\d[ -]*?){13,16}\b/g, replacement: "[REDACTED_CC]" },
  { name: "private-key-block", re: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/g, replacement: "[REDACTED_PRIVATE_KEY]" },
  { name: "aws", re: /\b(AKIA[0-9A-Z]{16}|aws_secret_access_key["'\s:=]+["']?[A-Za-z0-9/+=]{40})\b/g, replacement: "[REDACTED_AWS]" },
  { name: "github-pat", re: /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b/g, replacement: "[REDACTED_GITHUB_PAT]" },
  { name: "stripe", re: /\b(sk_live_[A-Za-z0-9]{16,}|sk_test_[A-Za-z0-9]{16,}|rk_live_[A-Za-z0-9]{16,}|whsec_[A-Za-z0-9]{16,})\b/g, replacement: "[REDACTED_STRIPE]" },
  { name: "slack-token", re: /\b(xox[bpors]-[A-Za-z0-9-]{10,})\b/g, replacement: "[REDACTED_SLACK]" },
  { name: "generic-secret", re: /\b(secret[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token|refresh[_-]?token|database[_-]?url|connection[_-]?string)["'\s:=]+["']?[A-Za-z0-9_:/+.\-=]{12,}/gi, replacement: "[REDACTED_SECRET]" },
  { name: "url-credentials", re: /:\/\/[^:/@\s"']+:[^@/\s"']+@/g, replacement: "://[REDACTED_URL_CREDENTIALS]@" },
];

interface ScrubResult {
  text: string;
  counts: Record<string, number>;
}

function scrub(text: string): ScrubResult {
  const counts: Record<string, number> = {};
  let out = text;
  for (const p of SCRUB_PATTERNS) {
    const before = out;
    out = out.replace(p.re, p.replacement);
    const matches = before.match(p.re);
    if (matches) counts[p.name] = matches.length;
  }
  return { text: out, counts };
}

function chunk(text: string, size: number): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = "";
  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > size && current) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

const STOPWORDS = new Set([
  "the","a","an","and","or","but","to","of","in","on","for","is","are","was","were","be","with","this","that","it","as","at","by","i","you","he","she","we","they","not","so","if","then","than","from","your","our","his","her","its",
]);

function keywords(text: string): string[] {
  const freq = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z0-9_-]{2,}/g) ?? []) {
    if (STOPWORDS.has(raw)) continue;
    freq.set(raw, (freq.get(raw) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputDir = resolve(args.input);
  const outputPath = resolve(args.output);

  let files: string[];
  try {
    files = readdirSync(inputDir).filter((f) => /\.(txt|md|log|json)$/i.test(f));
  } catch {
    console.error(`Error: cannot read input directory: ${inputDir}`);
    process.exit(1);
  }
  if (files.length === 0) {
    console.error(`Error: no .txt/.md/.log/.json files found in ${inputDir}`);
    process.exit(1);
  }

  mkdirSync(dirname(outputPath), { recursive: true });

  const records: object[] = [];
  let totalRedactions = 0;
  let chunksWritten = 0;

  for (const file of files) {
    const path = join(inputDir, file);
    const raw = readFileSync(path, "utf8");
    const { text, counts } = scrub(raw);
    const redactions = Object.values(counts).reduce((a, b) => a + b, 0);
    totalRedactions += redactions;
    for (const c of chunk(text, args.chunkSize)) {
      records.push({
        source: file,
        keywords: keywords(c),
        text: c,
      });
      chunksWritten++;
    }
    const flagged = Object.entries(counts).filter(([, n]) => n > 0);
    console.log(`scrubbed ${file}: ${redactions} redaction(s)${flagged.length ? ` [${flagged.map(([k, v]) => `${k}:${v}`).join(", ")}]` : ""}`);
  }

  const jsonl = records.map((r) => JSON.stringify(r)).join("\n");
  writeFileSync(outputPath, jsonl + "\n", "utf8");

  console.log("");
  console.log(`Files processed : ${files.length}`);
  console.log(`Chunks written : ${chunksWritten}`);
  console.log(`Total redactions: ${totalRedactions}`);
  console.log(`Output          : ${outputPath}`);
  console.log("");
  console.log("REVIEW the output for residual sensitive content before exposing it to a model.");
}

main();