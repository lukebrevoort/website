import { SpeedInsights } from "@vercel/speed-insights/next";
import HomepageWhiteboard from "@/components/homepage-whiteboard";

export default function Home() {
  return (
    <>
      <HomepageWhiteboard />
      <SpeedInsights />
    </>
  );
}
