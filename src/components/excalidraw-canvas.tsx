"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  NormalizedZoomValue,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import {
  applyCompiledPatchToElements,
  MAX_CANVAS_IMAGE_BYTES,
  MAX_CANVAS_IMAGE_DIMENSION,
  MAX_CONTEXT_ELEMENTS,
  NORMALIZED_CANVAS_SIZE,
  type CompiledCanvasPatch,
  type CanvasContextElement,
  type CanvasPatchContext,
} from "@/lib/canvas-agent";
import "@excalidraw/excalidraw/index.css";
import styles from "./excalidraw-canvas.module.css";

const HANDWRITING_FONT_URL = "/fonts/luke-brevoort-handwriting.otf";
const BOARD_STORAGE_KEY = "luke-explore-board-v1";
const MAX_LOCAL_BOARD_BYTES = 3_500_000;

let handwritingFontConfigured = false;

async function loadBrandedExcalidraw() {
  if (!handwritingFontConfigured && typeof window.FontFace !== "undefined") {
    const NativeFontFace = window.FontFace;

    window.FontFace = new Proxy(NativeFontFace, {
      construct(Target, args: ConstructorParameters<typeof FontFace>) {
        const [family, source, descriptors] = args;
        const brandedSource =
          family === "Virgil"
            ? `url(${HANDWRITING_FONT_URL}) format("opentype")`
            : source;

        return Reflect.construct(Target, [family, brandedSource, descriptors]);
      },
    });

    const handwritingFont = new window.FontFace(
      "Virgil",
      `url(${HANDWRITING_FONT_URL}) format("opentype")`,
    );

    await handwritingFont.load();
    document.fonts.add(handwritingFont);
    handwritingFontConfigured = true;
  }

  return (await import("@excalidraw/excalidraw")).Excalidraw;
}

const Excalidraw = dynamic(
  loadBrandedExcalidraw,
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading} role="status">
        Opening the sketchbook…
      </div>
    ),
  },
);

export type CanvasSnapshot = {
  api: ExcalidrawImperativeAPI | null;
  sceneElements: readonly ExcalidrawElement[];
  selectedElements: readonly ExcalidrawElement[];
  exportedCanvas: Blob | null;
  captureCanvasImage: () => Promise<Blob | null>;
  captureAgentContext: () => Promise<CanvasAgentContextCapture | null>;
  insertElements: (
    elements: ExcalidrawElementSkeleton[],
  ) => Promise<readonly ExcalidrawElement[]>;
  removeElements: (elementIds: readonly string[]) => void;
  getPatchContext: () => CanvasPatchContext | null;
  previewCompiledPatch: (patch: CompiledCanvasPatch) => Promise<void>;
  clearPatchPreview: () => void;
  applyCompiledPatch: (
    patch: CompiledCanvasPatch,
    options?: { confirmed?: boolean },
  ) => Promise<CanvasPatchApplyResult>;
  resetBoard: () => void;
};

export type CanvasAgentContextCapture = {
  scope: "selection" | "viewport";
  context: CanvasPatchContext;
  image: Blob;
};

export type CanvasPatchApplyResult =
  | { status: "applied"; elementIds: string[] }
  | { status: "confirmation-required"; reasons: string[] }
  | { status: "unavailable" };

type ExcalidrawCanvasProps = {
  onSnapshot?: (snapshot: CanvasSnapshot) => void;
};

const PREVIEW_ID_PREFIX = "canvas-change-preview:";

const emptySnapshot: CanvasSnapshot = {
  api: null,
  sceneElements: [],
  selectedElements: [],
  exportedCanvas: null,
  captureCanvasImage: async () => null,
  captureAgentContext: async () => null,
  insertElements: async () => [],
  removeElements: () => undefined,
  getPatchContext: () => null,
  previewCompiledPatch: async () => undefined,
  clearPatchPreview: () => undefined,
  applyCompiledPatch: async () => ({ status: "unavailable" }),
  resetBoard: () => undefined,
};

function isChangePreviewElement(element: ExcalidrawElement) {
  return (
    element.id.startsWith(PREVIEW_ID_PREFIX) ||
    Boolean((element.customData as { changePreview?: boolean } | null)?.changePreview)
  );
}

function loadPersistedBoard(): ExcalidrawInitialDataState | null {
  try {
    const raw = window.localStorage.getItem(BOARD_STORAGE_KEY);
    if (!raw || raw.length > MAX_LOCAL_BOARD_BYTES) return null;
    const parsed = JSON.parse(raw) as ExcalidrawInitialDataState;
    if (!parsed || !Array.isArray(parsed.elements) || typeof parsed.appState !== "object") return null;
    return parsed;
  } catch {
    window.localStorage.removeItem(BOARD_STORAGE_KEY);
    return null;
  }
}

function sceneVersion(elements: readonly ExcalidrawElement[]) {
  let hash = 2_166_136_261;
  const signature = elements
    .map((element) => `${element.id}:${element.version}:${element.versionNonce}`)
    .join("|");

  for (let index = 0; index < signature.length; index += 1) {
    hash ^= signature.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return `scene-${(hash >>> 0).toString(36)}`;
}

function contextKind(element: ExcalidrawElement): CanvasContextElement["kind"] | null {
  switch (element.type) {
    case "text":
    case "rectangle":
    case "ellipse":
    case "frame":
    case "arrow":
      return element.type;
    case "freedraw":
      return "freehand";
    default:
      return null;
  }
}

function normalizedBox(
  element: ExcalidrawElement,
  bounds: CanvasPatchContext["bounds"],
): CanvasContextElement["box"] | null {
  const rawX = Math.round(((element.x - bounds.x) / bounds.width) * NORMALIZED_CANVAS_SIZE);
  const rawY = Math.round(((element.y - bounds.y) / bounds.height) * NORMALIZED_CANVAS_SIZE);
  const rawWidth = Math.round((element.width / bounds.width) * NORMALIZED_CANVAS_SIZE);
  const rawHeight = Math.round((element.height / bounds.height) * NORMALIZED_CANVAS_SIZE);

  if (
    rawX >= NORMALIZED_CANVAS_SIZE ||
    rawY >= NORMALIZED_CANVAS_SIZE ||
    rawX + rawWidth <= 0 ||
    rawY + rawHeight <= 0
  ) {
    return null;
  }

  const x = Math.max(0, rawX);
  const y = Math.max(0, rawY);
  const width = Math.max(10, Math.min(NORMALIZED_CANVAS_SIZE - x, rawWidth));
  const height = Math.max(10, Math.min(NORMALIZED_CANVAS_SIZE - y, rawHeight));
  if (x + width > NORMALIZED_CANVAS_SIZE || y + height > NORMALIZED_CANVAS_SIZE) {
    return null;
  }

  return { x, y, width, height };
}

function viewportBounds(appState: AppState): CanvasPatchContext["bounds"] {
  const zoom = Math.max(0.01, appState.zoom.value);
  return {
    x: -appState.scrollX,
    y: -appState.scrollY,
    width: Math.max(1, appState.width / zoom),
    height: Math.max(1, appState.height / zoom),
  };
}

function selectionBounds(
  elements: readonly ExcalidrawElement[],
  fallback: CanvasPatchContext["bounds"],
): CanvasPatchContext["bounds"] {
  if (elements.length === 0) return fallback;
  const minX = Math.min(...elements.map((element) => element.x));
  const minY = Math.min(...elements.map((element) => element.y));
  const maxX = Math.max(...elements.map((element) => element.x + element.width));
  const maxY = Math.max(...elements.map((element) => element.y + element.height));
  const padding = Math.max(24, Math.min(120, Math.max(maxX - minX, maxY - minY) * 0.08));
  return {
    x: minX - padding,
    y: minY - padding,
    width: Math.max(1, maxX - minX + padding * 2),
    height: Math.max(1, maxY - minY + padding * 2),
  };
}

function intersectsBounds(element: ExcalidrawElement, bounds: CanvasPatchContext["bounds"]) {
  return element.x < bounds.x + bounds.width &&
    element.x + element.width > bounds.x &&
    element.y < bounds.y + bounds.height &&
    element.y + element.height > bounds.y;
}

function contextForElements(
  allElements: readonly ExcalidrawElement[],
  scopedElements: readonly ExcalidrawElement[],
  bounds: CanvasPatchContext["bounds"],
): CanvasPatchContext {
  const visibleElements = scopedElements.slice(0, MAX_CONTEXT_ELEMENTS);
  const refsByElementId = new Map(
    visibleElements.map((element) => [element.id, elementRef(element)]),
  );
  const elements = visibleElements.flatMap<CanvasContextElement>((element) => {
    const kind = contextKind(element);
    const box = normalizedBox(element, bounds);
    if (!kind || !box) return [];

    const customData = element.customData as Record<string, unknown> | undefined;
    const declaredOrigin = customData?.origin;
    const origin = declaredOrigin === "agent" || declaredOrigin === "system"
      ? declaredOrigin
      : "visitor";
    const text = element.type === "text" ? element.text.slice(0, 500) : undefined;
    const containerId = (element as ExcalidrawElement & { containerId?: string | null }).containerId;
    const containerRef = containerId ? refsByElementId.get(containerId) : undefined;

    return [{
      ref: elementRef(element),
      elementId: element.id,
      kind,
      box,
      origin,
      ...(text ? { text } : {}),
      ...(containerRef ? { containerRef } : {}),
    }];
  });

  return { sceneVersion: sceneVersion(allElements), bounds, elements };
}

function elementRef(element: ExcalidrawElement): `existing:${string}` {
  return `existing:${element.id.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()}`;
}

async function blankCanvasBlob() {
  const canvas = document.createElement("canvas");
  canvas.width = 1_024;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#f4f0e7";
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

export default function ExcalidrawCanvas({ onSnapshot }: ExcalidrawCanvasProps) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const snapshotRef = useRef<CanvasSnapshot>(emptySnapshot);
  const previewElementIds = useRef<string[]>([]);
  const persistenceTimer = useRef<number | null>(null);
  const persistenceRevision = useRef(0);
  const sceneRef = useRef<{
    elements: readonly ExcalidrawElement[];
    appState: AppState | null;
    files: BinaryFiles;
  }>({ elements: [], appState: null, files: {} });
  const [counts, setCounts] = useState({ scene: 0, selected: 0 });

  const schedulePersistence = useCallback((
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    const revision = ++persistenceRevision.current;
    if (persistenceTimer.current) window.clearTimeout(persistenceTimer.current);
    persistenceTimer.current = window.setTimeout(async () => {
      try {
        const { serializeAsJSON } = await import("@excalidraw/excalidraw");
        const serialized = serializeAsJSON(elements, appState, files, "local");
        if (revision !== persistenceRevision.current) return;
        if (serialized.length <= MAX_LOCAL_BOARD_BYTES) {
          window.localStorage.setItem(BOARD_STORAGE_KEY, serialized);
        } else {
          window.localStorage.removeItem(BOARD_STORAGE_KEY);
        }
      } catch {
        // Local recovery is best-effort; drawing must keep working if storage is unavailable.
      }
    }, 650);
  }, []);

  const publishSnapshot = useCallback(
    (snapshot: CanvasSnapshot) => {
      snapshotRef.current = snapshot;
      onSnapshot?.(snapshot);
    },
    [onSnapshot],
  );

  const captureCanvasImage = useCallback(async () => {
    const { elements, appState, files } = sceneRef.current;
    if (!appState || elements.length === 0) return null;

    try {
      const { exportToBlob } = await import("@excalidraw/excalidraw");
      const exportedCanvas = await exportToBlob({
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          exportWithDarkMode: false,
          viewBackgroundColor: "#f4f0e7",
        },
        files,
        mimeType: "image/png",
        exportPadding: 24,
      });

      publishSnapshot({
        ...snapshotRef.current,
        exportedCanvas,
      });
      return exportedCanvas;
    } catch (error) {
      console.warn("Unable to capture the current canvas image", error);
      return null;
    }
  }, [publishSnapshot]);

  const captureAgentContext = useCallback(async (): Promise<CanvasAgentContextCapture | null> => {
    const { elements, appState, files } = sceneRef.current;
    if (!appState) return null;

    const selected = elements.filter((element) => appState.selectedElementIds[element.id]);
    const scope = selected.length > 0 ? "selection" as const : "viewport" as const;
    const visibleBounds = viewportBounds(appState);
    const bounds = scope === "selection" ? selectionBounds(selected, visibleBounds) : visibleBounds;
    const scopedElements = (scope === "selection"
      ? selected
      : elements.filter((element) => intersectsBounds(element, bounds)))
      .slice(0, MAX_CONTEXT_ELEMENTS);
    const context = contextForElements(elements, scopedElements, bounds);

    try {
      const image = scopedElements.length === 0
        ? await blankCanvasBlob()
        : await (async () => {
            const { exportToBlob } = await import("@excalidraw/excalidraw");
            return exportToBlob({
              elements: scopedElements,
              appState: {
                ...appState,
                exportBackground: true,
                exportWithDarkMode: false,
                viewBackgroundColor: "#f4f0e7",
              },
              files,
              mimeType: "image/png",
              exportPadding: 24,
              maxWidthOrHeight: MAX_CANVAS_IMAGE_DIMENSION,
            });
          })();

      if (!image || image.size > MAX_CANVAS_IMAGE_BYTES) return null;
      publishSnapshot({ ...snapshotRef.current, exportedCanvas: image });
      return { scope, context, image };
    } catch (error) {
      console.warn("Unable to capture scoped canvas context", error);
      return null;
    }
  }, [publishSnapshot]);

  const insertElements = useCallback(
    async (elements: ExcalidrawElementSkeleton[]) => {
      const api = apiRef.current;
      if (!api || elements.length === 0) return [];

      const { CaptureUpdateAction, convertToExcalidrawElements } = await import(
        "@excalidraw/excalidraw"
      );
      const insertedElements = convertToExcalidrawElements(elements, {
        regenerateIds: false,
      });

      api.updateScene({
        elements: [...api.getSceneElements(), ...insertedElements],
        captureUpdate: CaptureUpdateAction.IMMEDIATELY,
      });
      api.setActiveTool({ type: "selection" });
      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const cameraElements = isMobile
        ? insertedElements.filter((element) =>
            /-(question|node-[0-2])$/.test(element.id),
          )
        : insertedElements;
      api.scrollToContent(cameraElements, {
        fitToViewport: true,
        viewportZoomFactor: isMobile ? 0.65 : 0.72,
        animate: true,
        duration: 450,
        maxZoom: 1.15,
        canvasOffsets: { top: 62, bottom: 155 },
      });
      api.setToast({
        message: "Added editable objects to your canvas",
        duration: 2400,
      });

      return insertedElements;
    },
    [],
  );

  const removeElements = useCallback((elementIds: readonly string[]) => {
    const api = apiRef.current;
    if (!api || elementIds.length === 0) return;

    const ids = new Set(elementIds);
    api.updateScene({
      elements: api.getSceneElements().map((element) =>
        ids.has(element.id) ? { ...element, isDeleted: true } : element,
      ),
    });
    api.setToast({ message: "Cleared the agent's sketch", duration: 1800 });
  }, []);

  const getPatchContext = useCallback((): CanvasPatchContext | null => {
    const { elements, appState } = sceneRef.current;
    if (!appState) return null;

    const bounds = viewportBounds(appState);
    return contextForElements(
      elements,
      elements.filter((element) => intersectsBounds(element, bounds)),
      bounds,
    );
  }, []);

  const clearPatchPreview = useCallback(() => {
    const api = apiRef.current;
    const previewIds = previewElementIds.current;
    if (!api || previewIds.length === 0) return;

    const ids = new Set(previewIds);
    previewElementIds.current = [];
    void import("@excalidraw/excalidraw").then(({ CaptureUpdateAction }) => {
      api.updateScene({
        elements: api.getSceneElements().map((element) =>
          ids.has(element.id) || element.id.startsWith(PREVIEW_ID_PREFIX)
            ? { ...element, isDeleted: true }
            : element,
        ),
        captureUpdate: CaptureUpdateAction.NEVER,
      });
    });
  }, []);

  const previewCompiledPatch = useCallback(
    async (patch: CompiledCanvasPatch) => {
      const api = apiRef.current;
      if (!api || patch.createElements.length === 0) return;

      const { CaptureUpdateAction, convertToExcalidrawElements } = await import(
        "@excalidraw/excalidraw"
      );

      if (previewElementIds.current.length > 0) {
        const staleIds = new Set(previewElementIds.current);
        previewElementIds.current = [];
        api.updateScene({
          elements: api.getSceneElements().map((element) =>
            staleIds.has(element.id) || element.id.startsWith(PREVIEW_ID_PREFIX)
              ? { ...element, isDeleted: true }
              : element,
          ),
          captureUpdate: CaptureUpdateAction.NEVER,
        });
      }

      const ghostSkeletons = patch.createElements.map((element) => ({
        ...element,
        id: `${PREVIEW_ID_PREFIX}${element.id}`,
        opacity: Math.min(
          typeof element.opacity === "number" ? element.opacity : 100,
          42,
        ),
        locked: true,
        strokeStyle: "dashed" as const,
        customData: {
          ...(element.customData && typeof element.customData === "object"
            ? element.customData
            : {}),
          changePreview: true,
        },
      }));

      const previewElements = convertToExcalidrawElements(ghostSkeletons, {
        regenerateIds: false,
      }).map((element) => ({
        ...element,
        opacity: Math.min(element.opacity ?? 100, 42),
        locked: true,
        customData: {
          ...(element.customData ?? {}),
          changePreview: true,
        },
      }));

      previewElementIds.current = previewElements.map((element) => element.id);
      api.updateScene({
        elements: [...api.getSceneElements(), ...previewElements],
        captureUpdate: CaptureUpdateAction.NEVER,
      });
      const isMobilePreview = window.matchMedia("(max-width: 760px)").matches;
      api.scrollToContent(previewElements, {
        fitToViewport: true,
        viewportZoomFactor: isMobilePreview ? 0.6 : 0.78,
        animate: true,
        duration: 360,
        maxZoom: 1.1,
        canvasOffsets: { top: 90, bottom: 170 },
      });
      api.setToast({
        message: "Previewing the proposed change — apply or keep the board as-is",
        duration: 2600,
      });
    },
    [],
  );

  const applyCompiledPatch = useCallback(
    async (
      patch: CompiledCanvasPatch,
      options: { confirmed?: boolean } = {},
    ): Promise<CanvasPatchApplyResult> => {
      const api = apiRef.current;
      if (!api) return { status: "unavailable" };

      if (patch.risk.requiresConfirmation && !options.confirmed) {
        return {
          status: "confirmation-required",
          reasons: patch.risk.reasons,
        };
      }

      const { CaptureUpdateAction, convertToExcalidrawElements } = await import(
        "@excalidraw/excalidraw"
      );

      // Drop any ghost preview before committing the real patch.
      const previewIds = new Set(previewElementIds.current);
      previewElementIds.current = [];
      const sceneWithoutPreview = api.getSceneElements().filter(
        (element) =>
          !previewIds.has(element.id) && !element.id.startsWith(PREVIEW_ID_PREFIX),
      );

      const createdElements = convertToExcalidrawElements(patch.createElements, {
        regenerateIds: false,
      });
      const nextElements = applyCompiledPatchToElements(
        sceneWithoutPreview,
        createdElements,
        patch,
      );

      // One captured scene update makes the accepted patch one undoable action.
      api.updateScene({
        elements: nextElements,
        captureUpdate: CaptureUpdateAction.IMMEDIATELY,
      });
      api.setActiveTool({ type: "selection" });
      if (createdElements.length > 0) {
        const isMobileApply = window.matchMedia("(max-width: 760px)").matches;
        api.scrollToContent(createdElements, {
          fitToViewport: true,
          viewportZoomFactor: isMobileApply ? 0.6 : 0.78,
          animate: true,
          duration: 420,
          maxZoom: 1.1,
          canvasOffsets: { top: 70, bottom: 210 },
        });
      }
      api.setToast({
        message: "Applied the agent's canvas update — undo anytime (⌘Z / Ctrl+Z)",
        duration: 2800,
      });

      return {
        status: "applied",
        elementIds: createdElements.map((element) => element.id),
      };
    },
    [],
  );

  const resetBoard = useCallback(() => {
    persistenceRevision.current += 1;
    if (persistenceTimer.current) window.clearTimeout(persistenceTimer.current);
    window.localStorage.removeItem(BOARD_STORAGE_KEY);
    previewElementIds.current = [];
    apiRef.current?.resetScene();
    apiRef.current?.history.clear();
    apiRef.current?.setToast({ message: "Started a fresh local board", duration: 1800 });
  }, []);

  const handleChange = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      const sceneElements = elements.filter(
        (element) => !element.isDeleted && !isChangePreviewElement(element),
      );
      const selectedElements = sceneElements.filter(
        (element) => appState.selectedElementIds[element.id],
      );
      sceneRef.current = { elements: sceneElements, appState, files };
      schedulePersistence(
        elements.filter((element) => !isChangePreviewElement(element)),
        appState,
        files,
      );

      setCounts((current) => {
        if (
          current.scene === sceneElements.length &&
          current.selected === selectedElements.length
        ) {
          return current;
        }
        return { scene: sceneElements.length, selected: selectedElements.length };
      });

      publishSnapshot({
        api: apiRef.current,
        sceneElements,
        selectedElements,
        exportedCanvas: snapshotRef.current.exportedCanvas,
        captureCanvasImage,
        captureAgentContext,
        insertElements,
        removeElements,
        getPatchContext,
        previewCompiledPatch,
        clearPatchPreview,
        applyCompiledPatch,
        resetBoard,
      });
    },
    [applyCompiledPatch, captureAgentContext, captureCanvasImage, clearPatchPreview, getPatchContext, insertElements, previewCompiledPatch, publishSnapshot, removeElements, resetBoard, schedulePersistence],
  );

  return (
    <div className={styles.root} data-testid="homepage-excalidraw">
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
          publishSnapshot({
            ...snapshotRef.current,
            api,
            captureCanvasImage,
            captureAgentContext,
            insertElements,
            removeElements,
            getPatchContext,
            previewCompiledPatch,
            clearPatchPreview,
            applyCompiledPatch,
            resetBoard,
          });
        }}
        initialData={() => {
          const recovered = loadPersistedBoard();
          const isMobile = typeof window !== "undefined" && window.innerWidth <= 760;
          const mobileZoom = 0.5 as NormalizedZoomValue;
          const desktopZoom = 1 as NormalizedZoomValue;
          const zoom = isMobile ? mobileZoom : desktopZoom;
          const defaultAppState = {
            currentItemStrokeColor: "#20201d",
            currentItemBackgroundColor: "transparent",
            currentItemFontFamily: 1,
            viewBackgroundColor: "#f4f0e7",
            zenModeEnabled: true,
            zoom: { value: zoom },
          };
          return recovered
            ? { ...recovered, appState: { ...recovered.appState, zenModeEnabled: true, zoom: { value: zoom } } }
            : { appState: defaultAppState };
        }}
        onChange={handleChange}
        theme="light"
        name="Luke's vision canvas"
      />
      <div className={styles.sceneStatus} aria-live="polite">
        {counts.scene} {counts.scene === 1 ? "mark" : "marks"} · {counts.selected}{" "}
        selected · saved locally
      </div>
    </div>
  );
}
