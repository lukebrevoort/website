import { SpeedInsights } from "@vercel/speed-insights/next";
import LandingStory from "@/components/landing-story";

export default function Home() {
  return (
    <>
      <LandingStory />
      <SpeedInsights />
    </>
  );
}
