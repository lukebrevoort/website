import type { Viewport } from "next";

/**
 * Explore is a full-viewport whiteboard. Prefer soft zoom mitigations
 * (16px inputs, touch-action: manipulation) over locking page scale so
 * low-vision users can still browser-zoom (WCAG 1.4.4 / 1.4.10).
 * Excalidraw continues to own in-canvas zoom.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
