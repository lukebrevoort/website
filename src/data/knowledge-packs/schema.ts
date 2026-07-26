export interface KnowledgePackComponent {
  name: string;
  role: string;
}

export interface KnowledgePackDesignDecision {
  decision: string;
  rationale: string;
}

export interface KnowledgePackLink {
  label: string;
  url: string;
}

export interface VisualToken {
  token: string;
  usage: string;
  value?: string;
}

export interface DiagramPattern {
  name: string;
  description: string;
  nodes: string[];
  style: string;
}

export interface KnowledgePackRelationship {
  toProject: string;
  relation: string;
}

export interface FollowUpQA {
  question: string;
  answer: string;
}

export interface KnowledgePack {
  slug: string;
  title: string;
  summary: string;
  purpose: string;
  intendedUser: string;
  architecture: string;
  components: KnowledgePackComponent[];
  designDecisions: KnowledgePackDesignDecision[];
  status: string;
  limitations: string[];
  technologies: string[];
  links: KnowledgePackLink[];
  visualVocabulary: VisualToken[];
  diagramPatterns: DiagramPattern[];
  relationships: KnowledgePackRelationship[];
  followUpQA: FollowUpQA[];
  brandColor: string;
  accentColor: string;
  emoji?: string;
  lastAuthored: string;
}

export const knowledgePackSlugs = [
  "malcom",
  "dispatch",
  "mytra",
  "orca-mail",
  "flowstate",
  "canvas-notion",
  "hftc",
  "zen80",
  "while-unemployed",
  "sga-finance",
  "website",
] as const;

export type KnowledgePackSlug = (typeof knowledgePackSlugs)[number];