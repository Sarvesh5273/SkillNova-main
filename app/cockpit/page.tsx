import { MissionControl } from "@/components/cockpit/mission-control";

export default function CockpitPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* We don't use standard layout padding here because we want full-screen immersion */}
      <MissionControl />
    </div>
  );
}