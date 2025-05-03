import Sidebar from "@/app/dashboard/page";
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function Home() {
  return (
    <div>
      <Sidebar />
      <SpeedInsights />
    </div>
  );
}
