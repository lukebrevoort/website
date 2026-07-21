import { knowledgePackSlugs, type KnowledgePack, type KnowledgePackSlug } from "./schema";
import { malcomPack } from "./malcom";
import { dispatchPack } from "./dispatch";
import { orcaMailPack } from "./orca-mail";
import { flowstatePack } from "./flowstate";
import { canvasNotionPack } from "./canvas-notion";
import { hftcPack } from "./hftc";
import { zen80Pack } from "./zen80";
import { whileUnemployedPack } from "./while-unemployed";
import { sgaFinancePack } from "./sga-finance";
import { personalWebsitePack } from "./personal-website";

export type { KnowledgePack, KnowledgePackSlug } from "./schema";

const packs: Record<KnowledgePackSlug, KnowledgePack> = {
  malcom: malcomPack,
  dispatch: dispatchPack,
  "orca-mail": orcaMailPack,
  flowstate: flowstatePack,
  "canvas-notion": canvasNotionPack,
  hftc: hftcPack,
  zen80: zen80Pack,
  "while-unemployed": whileUnemployedPack,
  "sga-finance": sgaFinancePack,
  website: personalWebsitePack,
};

export function listKnowledgePackSlugs(): readonly KnowledgePackSlug[] {
  return knowledgePackSlugs;
}

export interface KnowledgePackSummary {
  slug: string;
  title: string;
  summary: string;
  status: string;
  brandColor: string;
  accentColor: string;
  emoji?: string;
  lastAuthored: string;
}

export function listKnowledgePacks(): KnowledgePackSummary[] {
  return knowledgePackSlugs.map((slug) => {
    const pack = packs[slug];
    return {
      slug: pack.slug,
      title: pack.title,
      summary: pack.summary,
      status: pack.status,
      brandColor: pack.brandColor,
      accentColor: pack.accentColor,
      emoji: pack.emoji,
      lastAuthored: pack.lastAuthored,
    };
  });
}

export function getKnowledgePack(slug: string): KnowledgePack | undefined {
  return packs[slug as KnowledgePackSlug];
}

export function buildAgentPromptContext(slug: string): string | undefined {
  const pack = getKnowledgePack(slug);
  if (!pack) return undefined;

  const lines: string[] = [];
  lines.push(`# ${pack.title}`);
  lines.push(pack.summary);
  lines.push("");
  lines.push(`## Purpose`);
  lines.push(pack.purpose);
  lines.push(`Intended user: ${pack.intendedUser}`);
  lines.push("");
  lines.push(`## Architecture`);
  lines.push(pack.architecture);
  lines.push("");
  lines.push(`## Components`);
  for (const c of pack.components) lines.push(`- ${c.name}: ${c.role}`);
  lines.push("");
  lines.push(`## Design decisions`);
  for (const d of pack.designDecisions)
    lines.push(`- ${d.decision} — ${d.rationale}`);
  lines.push("");
  lines.push(`## Status`);
  lines.push(pack.status);
  lines.push("");
  lines.push(`## Honest limitations`);
  for (const l of pack.limitations) lines.push(`- ${l}`);
  lines.push("");
  lines.push(`## Technologies`);
  lines.push(pack.technologies.join(", "));
  if (pack.links.length) {
    lines.push("");
    lines.push(`## Links`);
    for (const link of pack.links) lines.push(`- ${link.label}: ${link.url}`);
  }
  lines.push("");
  lines.push(`## Visual vocabulary`);
  for (const v of pack.visualVocabulary)
    lines.push(`- ${v.token} (${v.usage})${v.value ? ` [${v.value}]` : ""}`);
  lines.push("");
  lines.push(`## Suggested diagram patterns`);
  for (const d of pack.diagramPatterns)
    lines.push(`- ${d.name}: ${d.description} — nodes: ${d.nodes.join(", ")}. Style: ${d.style}`);
  lines.push("");
  lines.push(`## Relationships to other projects`);
  for (const r of pack.relationships) lines.push(`- ${r.toProject}: ${r.relation}`);
  lines.push("");
  lines.push(`## Likely follow-up questions`);
  for (const q of pack.followUpQA)
    lines.push(`- Q: ${q.question}\n  A: ${q.answer}`);

  return lines.join("\n");
}