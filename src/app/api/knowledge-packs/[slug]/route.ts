import { NextResponse } from "next/server";
import {
  buildAgentPromptContext,
  getKnowledgePack,
} from "@/data/knowledge-packs";

export const dynamic = "force-static";

export function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return (async () => {
    const { slug } = await params;
    const pack = getKnowledgePack(slug);
    if (!pack) {
      return NextResponse.json(
        { error: `Unknown knowledge pack: ${slug}` },
        { status: 404 },
      );
    }
    return NextResponse.json({
      pack,
      prompt: buildAgentPromptContext(slug),
    });
  })();
}