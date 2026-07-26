import { redirect } from "next/navigation";
import { listKnowledgePacks } from "@/data/knowledge-packs";
import KnowledgePackViewer from "@/components/knowledge-pack-viewer";

export const dynamic = "force-static";

export default function KnowledgePacksPage() {
  const isProd =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview";

  if (isProd) {
    redirect("/projects");
  }

  const summaries = listKnowledgePacks();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm font-medium text-muted-foreground">
            BRE-145 · Dev-only
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Agent Knowledge Packs
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Curated, authored knowledge for the visual agent. Select a project
            to inspect its pack, the generated agent prompt context, diagram
            patterns, and likely follow-up answers. Packs are data files —
            update them without touching the canvas UI.
          </p>
        </header>
        <KnowledgePackViewer summaries={summaries} />
      </div>
    </main>
  );
}