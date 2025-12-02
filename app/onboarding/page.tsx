import Plasma from "@/components/plasma";
import { OriginStory } from "@/components/onboarding/origin";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0">
        <Plasma 
            color="#C6FF3A" // Using your Lime color for the nebula
            speed={0.5} 
            direction="forward" 
            scale={1.5} 
            opacity={0.3} 
            mouseInteractive={true} 
        />
      </div>
      
      {/* Main Content */}
      <OriginStory />
    </div>
  );
}