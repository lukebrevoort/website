"use client";

import { useState } from "react";
import type { KnowledgePackSummary } from "@/data/knowledge-packs";
import { type KnowledgePack } from "@/data/knowledge-packs/schema";

interface Props {
  summaries: KnowledgePackSummary[];
}

type Tab = "pack" | "prompt";

export default function KnowledgePackViewer({ summaries }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>(summaries[0]?.slug ?? "");
  const [pack, setPack] = useState<KnowledgePack | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pack");
  const [copied, setCopied] = useState(false);

  async function loadPack(slug: string) {
    setActiveSlug(slug);
    setPack(null);
    setPrompt(null);
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge-packs/${slug}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { pack: KnowledgePack; prompt: string };
      setPack(data.pack);
      setPrompt(data.prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pack");
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <nav className="space-y-2">
        {summaries.map((s) => {
          const active = s.slug === activeSlug;
          return (
            <button
              key={s.slug}
              onClick={() => loadPack(s.slug)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                active
                  ? "border-foreground/20 bg-foreground/5"
                  : "border-transparent hover:border-foreground/10 hover:bg-foreground/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2">
                {s.emoji && <span>{s.emoji}</span>}
                <span className="font-semibold">{s.title}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {s.summary}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.brandColor }}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.accentColor }}
                />
                <span className="text-[11px] text-muted-foreground">
                  {s.lastAuthored}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <section className="min-h-[60vh] rounded-2xl border border-foreground/10 p-6">
        {loading && <p className="text-muted-foreground">Loading pack…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !pack && !error && (
          <p className="text-muted-foreground">Select a project to inspect its knowledge pack.</p>
        )}
        {pack && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {pack.emoji ? `${pack.emoji} ` : ""}
                  {pack.title}
                </h2>
                <p className="mt-1 max-w-2xl text-muted-foreground">{pack.summary}</p>
              </div>
              <div className="flex rounded-lg border border-foreground/10 p-1 text-sm">
                <button
                  onClick={() => setTab("pack")}
                  className={`rounded-md px-3 py-1 ${tab === "pack" ? "bg-foreground/10 font-medium" : "text-muted-foreground"}`}
                >
                  Pack
                </button>
                <button
                  onClick={() => setTab("prompt")}
                  className={`rounded-md px-3 py-1 ${tab === "prompt" ? "bg-foreground/10 font-medium" : "text-muted-foreground"}`}
                >
                  Agent prompt
                </button>
              </div>
            </div>

            {tab === "prompt" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Synthetic context delivered to the model for this project.
                  </span>
                  <button
                    onClick={copyPrompt}
                    className="rounded-md border border-foreground/15 px-3 py-1 text-xs hover:bg-foreground/5"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="overflow-auto rounded-xl bg-foreground/[0.03] p-4 text-xs leading-relaxed whitespace-pre-wrap">
                  {prompt ?? ""}
                </pre>
              </div>
            ) : (
              <div className="space-y-6">
                <Field label="Purpose">{pack.purpose}</Field>
                <Field label="Intended user">{pack.intendedUser}</Field>
                <Field label="Architecture">{pack.architecture}</Field>

                <Field label="Components">
                  <ul className="space-y-1">
                    {pack.components.map((c) => (
                      <li key={c.name} className="text-sm">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-muted-foreground"> — {c.role}</span>
                      </li>
                    ))}
                  </ul>
                </Field>

                <Field label="Design decisions">
                  <ul className="space-y-1">
                    {pack.designDecisions.map((d) => (
                      <li key={d.decision} className="text-sm">
                        <span className="font-medium">{d.decision}</span>
                        <span className="text-muted-foreground"> — {d.rationale}</span>
                      </li>
                    ))}
                  </ul>
                </Field>

                <Field label="Status">{pack.status}</Field>

                <Field label="Honest limitations">
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {pack.limitations.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </Field>

                <Field label="Technologies">
                  <div className="flex flex-wrap gap-2">
                    {pack.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-foreground/10 px-3 py-1 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Field>

                {pack.links.length > 0 && (
                  <Field label="Links">
                    <ul className="space-y-1 text-sm">
                      {pack.links.map((l) => (
                        <li key={l.url}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2"
                          >
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Field>
                )}

                <Field label="Visual vocabulary">
                  <ul className="space-y-1 text-sm">
                    {pack.visualVocabulary.map((v) => (
                      <li key={v.token} className="flex items-center gap-2">
                        {v.value && (
                          <span
                            className="h-3 w-3 rounded-full border border-foreground/10"
                            style={{ backgroundColor: v.value }}
                          />
                        )}
                        <span className="font-medium">{v.token}</span>
                        <span className="text-muted-foreground">— {v.usage}</span>
                      </li>
                    ))}
                  </ul>
                </Field>

                <Field label="Suggested diagram patterns">
                  <div className="space-y-3">
                    {pack.diagramPatterns.map((d) => (
                      <div
                        key={d.name}
                        className="rounded-xl border border-foreground/10 p-4"
                      >
                        <p className="font-medium">{d.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {d.description}
                        </p>
                        <p className="mt-2 text-xs">
                          <span className="font-medium">Nodes:</span>{" "}
                          {d.nodes.join(", ")}
                        </p>
                        <p className="mt-1 text-xs">
                          <span className="font-medium">Style:</span> {d.style}
                        </p>
                      </div>
                    ))}
                  </div>
                </Field>

                <Field label="Relationships">
                  <ul className="space-y-1 text-sm">
                    {pack.relationships.map((r) => (
                      <li key={r.toProject}>
                        <span className="font-medium">{r.toProject}</span>
                        <span className="text-muted-foreground"> — {r.relation}</span>
                      </li>
                    ))}
                  </ul>
                </Field>

                <Field label="Likely follow-up questions">
                  <div className="space-y-3">
                    {pack.followUpQA.map((q) => (
                      <div
                        key={q.question}
                        className="rounded-xl border border-foreground/10 p-4"
                      >
                        <p className="font-medium">Q: {q.question}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          A: {q.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </Field>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}