import { SpeedInsights } from "@vercel/speed-insights/next";
import HomepageWhiteboard from "@/components/homepage-whiteboard";

export default function ExplorePage() {
  return (
    <>
      <HomepageWhiteboard />
      <SpeedInsights />
    </>
  );
}
