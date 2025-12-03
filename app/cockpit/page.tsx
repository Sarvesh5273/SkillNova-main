import { MissionControl } from "@/components/cockpit/mission-control";
import { getNodeDetails } from "@/app/actions/cockpit";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { nodeId?: string };
}

export default async function CockpitPage({ searchParams }: PageProps) {
  // 1. Security Check: If no ID, go back to map
  if (!searchParams.nodeId) {
    redirect("/dashboard");
  }

  // 2. Fetch Real Data from Supabase
  const data = await getNodeDetails(searchParams.nodeId);

  // 3. Handle Errors (Node not found)
  if (!data || !data.node) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        <h1 className="text-xl font-bold text-red-500">Mission Data Not Found</h1>
        <p className="text-gray-400">Unable to load node ID: {searchParams.nodeId}</p>
        <a href="/dashboard" className="text-lime-400 hover:underline">Return to Map</a>
      </div>
    );
  }

  // 4. Render with REAL Video URL
  return (
    <div className="min-h-screen bg-black">
      <MissionControl 
        nodeId={data.node.id}
        title={data.node.title}
        videoUrl={data.node.video_url || ""} // <--- Passing the URL here
        description={data.node.description}
      />
    </div>
  );
}