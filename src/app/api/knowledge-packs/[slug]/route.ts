import { NextResponse } from "next/server";
import {
  buildAgentPromptContext,
  getKnowledgePack,
} from "@/data/knowledge-packs";

export const dynamic = "force-static";

const isProdEnv =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview";

export function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return (async () => {
    if (isProdEnv) {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 404 },
      );
    }
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