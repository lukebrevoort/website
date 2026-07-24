import { z } from "zod";
import {
  MAX_PATCH_OPERATIONS,
  canvasPatchSchema,
  type CanvasPatch,
} from "../contract";
import type { CanvasPatchContext } from "../validation";

/**
 * Flat drawing ops inspired by Dispatch #735 whiteboard_update.
 * The model only invents simple geometry; we expand into CanvasPatchV1.
 */
export const MAX_SIMPLE_OPS = 16;

const simpleIdSchema = z
  .string()
  .trim()
  .regex(/^(existing:)?[a-z0-9][a-z0-9_-]{0,47}$/i)
  .max(56);

export const canvasSimpleOpsGenerationSchema = z.strictObject({
  version: z.literal("1"),
  baseSceneVersion: z.string().trim().min(1).max(128),
  summary: z.string().trim().min(1).max(300),
  ops: z.array(z.strictObject({
    op: z.enum(["add", "connect"]),
    id: z.string().trim().min(1).max(56).nullable(),
    type: z.enum(["rect", "ellipse", "note", "text"]).nullable(),
    x: z.number().int().min(0).max(1000).nullable(),
    y: z.number().int().min(0).max(1000).nullable(),
    w: z.number().int().min(10).max(1000).nullable(),
    h: z.number().int().min(10).max(1000).nullable(),
    label: z.string().trim().min(1).max(160).nullable(),
    from: z.string().trim().min(1).max(56).nullable(),
    to: z.string().trim().min(1).max(56).nullable(),
    theme: z.enum(["ink", "muted", "accent", "info", "success", "warning"]).nullable(),
  })).min(1).max(MAX_SIMPLE_OPS),
});

export type CanvasSimpleOpsDraft = z.infer<typeof canvasSimpleOpsGenerationSchema>;

export type PlacementRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  mode: "full" | "below" | "right";
};

const DEFAULT_NODE_W = 200;
const DEFAULT_NODE_H = 110;
const DEFAULT_TEXT_W = 280;
const DEFAULT_TEXT_H = 70;
const GAP = 48;

export function suggestPlacementRegion(
  context: Pick<CanvasPatchContext, "elements">,
  priorTurnCount: number,
): PlacementRegion {
  const boxes = context.elements.filter((element) =>
    element.kind !== "arrow" && element.kind !== "freehand" && element.kind !== "frame"
  );
  if (priorTurnCount <= 0 || boxes.length === 0) {
    return { x: 50, y: 50, width: 900, height: 900, mode: "full" };
  }

  let minX = 1000;
  let minY = 1000;
  let maxX = 0;
  let maxY = 0;
  for (const element of boxes) {
    minX = Math.min(minX, element.box.x);
    minY = Math.min(minY, element.box.y);
    maxX = Math.max(maxX, element.box.x + element.box.width);
    maxY = Math.max(maxY, element.box.y + element.box.height);
  }

  const belowTop = Math.min(1000 - 220, maxY + GAP);
  const belowHeight = 1000 - belowTop - 40;
  if (belowHeight >= 280) {
    return {
      x: clamp(minX, 40, 200),
      y: belowTop,
      width: clamp(Math.max(maxX - minX, 520), 400, 920),
      height: belowHeight,
      mode: "below",
    };
  }

  const rightLeft = Math.min(1000 - 280, maxX + GAP);
  return {
    x: rightLeft,
    y: clamp(minY, 40, 200),
    width: Math.max(240, 1000 - rightLeft - 40),
    height: clamp(Math.max(maxY - minY, 420), 300, 920),
    mode: "right",
  };
}

export function convertSimpleOpsToCanvasPatch(
  draft: CanvasSimpleOpsDraft,
  options: { placement?: PlacementRegion; priorTurnCount?: number } = {},
): CanvasPatch {
  type PendingAdd = {
    ref: `new:${string}`;
    type: "rect" | "ellipse" | "note" | "text";
    label?: string;
    theme: "ink" | "muted" | "accent" | "info" | "success" | "warning";
    box: { x: number; y: number; w: number; h: number };
  };

  const created = new Set<string>();
  const pendingAdds: PendingAdd[] = [];
  const pendingConnects: Array<{
    ref: `new:${string}`;
    from: `new:${string}` | `existing:${string}`;
    to: `new:${string}` | `existing:${string}`;
    label?: string;
    theme: "ink" | "muted" | "accent" | "info" | "success" | "warning";
  }> = [];

  for (const [index, op] of draft.ops.entries()) {
    if (op.op === "add") {
      const rawId = op.id?.trim() || `shape-${index + 1}`;
      const ref = toNewRef(rawId);
      if (created.has(ref)) continue;
      const type = op.type || "rect";
      const label = op.label?.trim();
      pendingAdds.push({
        ref,
        type,
        ...(label ? { label } : {}),
        theme: op.theme || (type === "note" ? "warning" : "ink"),
        box: clampBox(
          op.x ?? 80,
          op.y ?? 80,
          op.w ?? (type === "text" ? DEFAULT_TEXT_W : DEFAULT_NODE_W),
          op.h ?? (type === "text" ? DEFAULT_TEXT_H : DEFAULT_NODE_H),
        ),
      });
      created.add(ref);
      continue;
    }

    if (op.op === "connect") {
      const from = resolveRef(op.from);
      const to = resolveRef(op.to);
      if (!from || !to || from === to) continue;
      const rawId = op.id?.trim() || `${stripRef(from)}-${stripRef(to)}`;
      pendingConnects.push({
        ref: toNewRef(rawId),
        from,
        to,
        ...(op.label ? { label: op.label.trim() } : {}),
        theme: op.theme || "muted",
      });
    }
  }

  if (pendingAdds.length === 0 && pendingConnects.length === 0) {
    throw new SimpleOpsConversionError("No usable drawing operations were produced.");
  }

  const placement = options.placement;
  if ((options.priorTurnCount ?? 0) > 0 && placement && placement.mode !== "full" && pendingAdds.length > 0) {
    shiftAddsIntoRegion(pendingAdds, placement);
  }

  const operations: CanvasPatch["operations"] = [];
  for (const add of pendingAdds) {
    const { x, y, w, h } = add.box;
    if (add.type === "text") {
      operations.push({
        op: "create",
        ref: add.ref,
        element: {
          kind: "text",
          box: { x, y, width: w, height: h },
          text: add.label || "Note",
          style: { theme: add.theme },
        },
      });
      continue;
    }
    operations.push({
      op: "create",
      ref: add.ref,
      element: {
        kind: add.type === "rect" ? "rectangle" : add.type,
        box: { x, y, width: w, height: h },
        ...(add.label ? { text: add.label } : {}),
        style: { theme: add.theme, fill: "hachure" },
      },
    });
  }

  for (const connect of pendingConnects) {
    operations.push({
      op: "connect",
      ref: connect.ref,
      from: connect.from,
      to: connect.to,
      ...(connect.label ? { label: connect.label } : {}),
      style: { theme: connect.theme },
    });
  }

  if (operations.length === 0) {
    throw new SimpleOpsConversionError("No usable drawing operations were produced.");
  }
  if (operations.length > MAX_PATCH_OPERATIONS) {
    operations.length = MAX_PATCH_OPERATIONS;
  }

  return canvasPatchSchema.parse({
    version: "1",
    baseSceneVersion: draft.baseSceneVersion,
    summary: draft.summary,
    operations,
  });
}

export class SimpleOpsConversionError extends Error {}

function shiftAddsIntoRegion(
  adds: Array<{ box: { x: number; y: number; w: number; h: number } }>,
  region: PlacementRegion,
) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const add of adds) {
    minX = Math.min(minX, add.box.x);
    minY = Math.min(minY, add.box.y);
    maxX = Math.max(maxX, add.box.x + add.box.w);
    maxY = Math.max(maxY, add.box.y + add.box.h);
  }
  const clusterW = Math.max(10, maxX - minX);
  const targetX = region.x + Math.max(0, Math.floor((region.width - Math.min(clusterW, region.width)) / 2));
  const targetY = region.y + 12;
  const dx = targetX - minX;
  const dy = targetY - minY;

  for (const add of adds) {
    const next = clampBox(add.box.x + dx, add.box.y + dy, add.box.w, add.box.h);
    add.box = {
      x: clamp(next.x, region.x, region.x + region.width - next.w),
      y: clamp(next.y, region.y, region.y + region.height - next.h),
      w: next.w,
      h: next.h,
    };
  }
}

function toNewRef(id: string): `new:${string}` {
  const cleaned = id.replace(/^new:/i, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  const safe = (cleaned || "shape").slice(0, 48);
  return `new:${safe}`;
}

function resolveRef(value: string | null | undefined): `new:${string}` | `existing:${string}` | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^existing:[a-z0-9][a-z0-9_-]{0,63}$/i.test(trimmed)) {
    return trimmed.toLowerCase() as `existing:${string}`;
  }
  if (/^new:[a-z0-9][a-z0-9_-]{0,63}$/i.test(trimmed)) {
    return trimmed.toLowerCase() as `new:${string}`;
  }
  if (simpleIdSchema.safeParse(trimmed).success && !trimmed.startsWith("existing:")) {
    return toNewRef(trimmed);
  }
  return null;
}

function stripRef(ref: string) {
  return ref.replace(/^(new|existing):/, "");
}

function clampBox(x: number, y: number, w: number, h: number) {
  const cx = clamp(Math.round(x), 0, 990);
  const cy = clamp(Math.round(y), 0, 990);
  return {
    x: cx,
    y: cy,
    w: clamp(Math.round(w), 10, 1000 - cx),
    h: clamp(Math.round(h), 10, 1000 - cy),
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
