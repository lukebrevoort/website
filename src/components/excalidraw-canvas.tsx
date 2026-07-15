"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import {
  applyCompiledPatchToElements,
  type CompiledCanvasPatch,
} from "@/lib/canvas-agent";
import "@excalidraw/excalidraw/index.css";
import styles from "./excalidraw-canvas.module.css";

const HANDWRITING_FONT_URL = "/fonts/luke-brevoort-handwriting.otf";

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
  insertElements: (
    elements: ExcalidrawElementSkeleton[],
  ) => Promise<readonly ExcalidrawElement[]>;
  removeElements: (elementIds: readonly string[]) => void;
  applyCompiledPatch: (
    patch: CompiledCanvasPatch,
    options?: { confirmed?: boolean },
  ) => Promise<CanvasPatchApplyResult>;
};

export type CanvasPatchApplyResult =
  | { status: "applied"; elementIds: string[] }
  | { status: "confirmation-required"; reasons: string[] }
  | { status: "unavailable" };

type ExcalidrawCanvasProps = {
  onSnapshot?: (snapshot: CanvasSnapshot) => void;
};

const emptySnapshot: CanvasSnapshot = {
  api: null,
  sceneElements: [],
  selectedElements: [],
  exportedCanvas: null,
  captureCanvasImage: async () => null,
  insertElements: async () => [],
  removeElements: () => undefined,
  applyCompiledPatch: async () => ({ status: "unavailable" }),
};

export default function ExcalidrawCanvas({ onSnapshot }: ExcalidrawCanvasProps) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const snapshotRef = useRef<CanvasSnapshot>(emptySnapshot);
  const sceneRef = useRef<{
    elements: readonly ExcalidrawElement[];
    appState: AppState | null;
    files: BinaryFiles;
  }>({ elements: [], appState: null, files: {} });
  const [counts, setCounts] = useState({ scene: 0, selected: 0 });

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
        viewportZoomFactor: isMobile ? 0.82 : 0.72,
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
      const createdElements = convertToExcalidrawElements(patch.createElements, {
        regenerateIds: false,
      });
      const nextElements = applyCompiledPatchToElements(
        api.getSceneElements(),
        createdElements,
        patch,
      );

      // One captured scene update makes the accepted patch one undoable action.
      api.updateScene({
        elements: nextElements,
        captureUpdate: CaptureUpdateAction.IMMEDIATELY,
      });
      api.setActiveTool({ type: "selection" });
      api.setToast({ message: "Applied the agent's canvas update", duration: 2200 });

      return {
        status: "applied",
        elementIds: createdElements.map((element) => element.id),
      };
    },
    [],
  );

  const handleChange = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      const sceneElements = elements.filter((element) => !element.isDeleted);
      const selectedElements = sceneElements.filter(
        (element) => appState.selectedElementIds[element.id],
      );
      sceneRef.current = { elements: sceneElements, appState, files };

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
        insertElements,
        removeElements,
        applyCompiledPatch,
      });
    },
    [applyCompiledPatch, captureCanvasImage, insertElements, publishSnapshot, removeElements],
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
            insertElements,
            removeElements,
            applyCompiledPatch,
          });
        }}
        initialData={{
          appState: {
            currentItemStrokeColor: "#20201d",
            currentItemBackgroundColor: "transparent",
            currentItemFontFamily: 1,
            viewBackgroundColor: "#f4f0e7",
          },
        }}
        onChange={handleChange}
        theme="light"
        name="Luke's vision canvas"
      />
      <div className={styles.sceneStatus} aria-live="polite">
        {counts.scene} {counts.scene === 1 ? "mark" : "marks"} · {counts.selected}{" "}
        selected
      </div>
    </div>
  );
}
