import { getUserRoadmap } from "@/app/actions/dashboard";
import Plasma from "@/components/plasma";
import { MapView } from "@/components/dashboard/map-view";
import { HUD } from "@/components/dashboard/hud";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Server-Side Data Fetching
  const nodes = await getUserRoadmap();

  // 2. Security Check: If no roadmap exists, send back to Origin
  if (!nodes || nodes.length === 0) {
    redirect("/onboarding");
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Plasma color="#4f46e5" speed={0.4} opacity={0.3} scale={2} />
      </div>

      {/* HUD (Fixed Top) */}
      <HUD />

      {/* Map (Scrollable) */}
      <div className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto pt-32 pb-24 px-4">
            <h1 className="text-3xl font-bold text-center text-white mb-2">Current Trajectory</h1>
            <p className="text-center text-gray-400 mb-12">Target: Senior Engineer</p>
            
            {/* Pass Real Data to Map */}
            <MapView nodes={nodes} />
        </div>
      </div>

      {/* Floating Chat */}
      <Link href="/chat">
        <Button 
            className="fixed bottom-8 right-8 z-50 rounded-full w-14 h-14 bg-lime-500 hover:bg-lime-400 text-black shadow-[0_0_20px_rgba(198,255,58,0.5)] transition-all hover:scale-110"
        >
            <MessageSquare className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}