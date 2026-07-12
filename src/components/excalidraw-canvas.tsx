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
import "@excalidraw/excalidraw/index.css";
import styles from "./excalidraw-canvas.module.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
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
};

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
      api.scrollToContent(insertedElements, {
        fitToViewport: true,
        viewportZoomFactor: 0.72,
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
      });
    },
    [captureCanvasImage, insertElements, publishSnapshot],
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
          });
        }}
        initialData={{
          appState: {
            currentItemStrokeColor: "#20201d",
            currentItemBackgroundColor: "transparent",
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
