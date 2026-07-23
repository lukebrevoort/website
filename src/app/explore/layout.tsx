import type { Viewport } from "next";

/**
 * Explore is a full-viewport whiteboard. Accidental browser zoom (input focus
 * scale, pinch, double-tap) is hard to undo because the canvas itself also zooms.
 * Lock page scale on this route only; Excalidraw still handles in-canvas zoom.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
