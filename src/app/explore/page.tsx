import { SpeedInsights } from "@vercel/speed-insights/next";
import HomepageWhiteboard from "@/components/homepage-whiteboard";

export default function ExplorePage() {
  const canvasDebugEnabled =
    process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

  return (
    <>
      <HomepageWhiteboard canvasDebugEnabled={canvasDebugEnabled} />
      <SpeedInsights />
    </>
  );
}
