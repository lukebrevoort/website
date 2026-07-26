import { NextResponse } from "next/server";
import { listKnowledgePacks } from "@/data/knowledge-packs";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ packs: listKnowledgePacks() });
}