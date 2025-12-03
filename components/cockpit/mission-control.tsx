"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { completeNode } from "@/app/actions/progress"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// FIX: Use the main 'react-player' import. This is the most reliable way.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface MissionControlProps {
  nodeId: string;
  title: string;
  videoUrl: string;
  description: string | null;
}

export function MissionControl({ nodeId, title, videoUrl, description }: MissionControlProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleVideoEnd = async () => {
    toast.info("Mission Data Uploading...");
    const result = await completeNode(nodeId);
    
    if (result.success) {
        toast.success("Mission Complete! Next Node Unlocked.");
        setTimeout(() => router.push("/dashboard"), 2000);
    } else {
        toast.error("Error saving progress.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-black relative">
      
      {/* LEFT: VIDEO AREA */}
      <div className={cn("relative transition-all duration-500 ease-in-out h-full", isChatOpen ? "w-[70%]" : "w-full")}>
        <div className="relative w-full h-full flex flex-col">
            <div className="flex-1 relative bg-black flex items-center justify-center">
                {hasMounted && videoUrl ? (
                  <div className="w-full h-full">
                    <ReactPlayer
                        url={videoUrl}
                        controls={true}
                        width="100%"
                        height="100%"
                        playing={false}
                        onEnded={handleVideoEnd}
                        config={{
                            youtube: { 
                                playerVars: { showinfo: 0, modestbranding: 1 } 
                            }
                        }}
                    />
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center gap-2">
                    {!hasMounted ? (
                        <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
                    ) : (
                        <>
                            <p className="text-gray-500">No Video Feed Available</p>
                            <p className="text-xs text-gray-700">Node ID: {nodeId}</p>
                        </>
                    )}
                  </div>
                )}
            </div>

            {/* Bottom Bar: Mission Intel */}
            <div className="h-48 border-t border-white/10 bg-[#0a0a0a] p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mission Briefing: {title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                    {description || "No description available."}
                </p>
            </div>
        </div>

        {/* Chat Trigger */}
        {!isChatOpen && (
            <Button 
                onClick={() => setIsChatOpen(true)}
                className="absolute top-6 right-6 z-10 bg-lime-500/10 text-lime-400 hover:bg-lime-500 hover:text-black border border-lime-500/50 backdrop-blur-md rounded-full px-4 gap-2 shadow-lg"
            >
                <MessageSquare className="w-4 h-4" />
                <span>Copilot</span>
            </Button>
        )}
      </div>

      {/* RIGHT: COPILOT SIDEBAR */}
      <AnimatePresence>
        {isChatOpen && (
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="w-[30%] h-full border-l border-white/10 bg-[#131314] flex flex-col absolute right-0 top-0 z-20 shadow-2xl"
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                        <span className="font-bold text-white">SkillNova Live</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 text-gray-400">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex-1 p-4 text-gray-400 text-sm">
                    <p>I am monitoring your progress on <strong>{title}</strong>.</p>
                    <br />
                    <p>Ask me to explain any concept from the video.</p>
                </div>

                <div className="p-4 bg-[#1a1a1a] border-t border-white/10">
                    <form className="relative">
                        <Input 
                            placeholder="Ask about this video..." 
                            className="bg-black/50 border-white/10 text-white pr-10 focus-visible:ring-lime-500/50"
                        />
                        <button type="submit" className="absolute right-2 top-2.5 text-lime-500 hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}