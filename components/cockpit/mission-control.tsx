"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ChevronRight, Sparkles, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { completeNode } from "@/app/actions/progress"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card"; 
import { createClient } from "@/lib/supabase/client";

interface MissionControlProps {
  nodeId: string;
  title: string;
  videoUrl: string;
  description: string | null;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MissionControl({ nodeId, title, videoUrl, description }: MissionControlProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false); // Loading state for completion
  
  // Quiz State
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizzesTaken, setQuizzesTaken] = useState<string[]>([]);
  
  // Player State
  const [playerReady, setPlayerReady] = useState(false);
  
  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // 1. Fetch Quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
        const { data } = await supabase
            .from('quizzes')
            .select('*')
            .eq('node_id', nodeId);
        if (data) setQuizzes(data);
    };
    fetchQuizzes();
  }, [nodeId, supabase]);

  // Helper: Extract Video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 2. Initialize Native YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      const videoId = getYouTubeId(videoUrl);
      if (!videoId || !containerRef.current) return;

      if (playerRef.current) playerRef.current.destroy();

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'modestbranding': 1,
          'rel': 0,
          'autoplay': 1, 
          'mute': 1      
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videoUrl]);

  const onPlayerReady = (event: any) => {
    setPlayerReady(true);
    intervalRef.current = setInterval(checkQuizTime, 1000);
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === 0) handleVideoEnd(); // Auto-complete on end
  };

  const checkQuizTime = () => {
    if (!playerRef.current || !playerRef.current.getCurrentTime || quizzes.length === 0) return;
    const currentTime = Math.floor(playerRef.current.getCurrentTime());
    const quiz = quizzes.find(q => q.timestamp === currentTime && !quizzesTaken.includes(q.id));

    if (quiz) {
        playerRef.current.pauseVideo(); 
        setActiveQuiz(quiz);
    }
  };

  const handleQuizComplete = (success: boolean) => {
    if (success && activeQuiz) {
        setQuizzesTaken(prev => [...prev, activeQuiz.id]);
        setActiveQuiz(null);
        playerRef.current.playVideo(); 
        toast.success("Correct! System Resuming...");
    }
  };

  // 3. The Completion Logic (Used by both Auto-End and Manual Button)
  const handleVideoEnd = async () => {
    if (isCompleting) return; // Prevent double clicks
    setIsCompleting(true);
    
    toast.info("Uploading Mission Data...");
    
    const result = await completeNode(nodeId);
    
    if (result.success) {
        toast.success("Mission Complete! Next Node Unlocked.");
        setTimeout(() => router.push("/dashboard"), 1500);
    } else {
        toast.error("Error saving progress. Please try again.");
        setIsCompleting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-black relative">
      
      {/* LEFT: VIDEO AREA */}
      <div className={cn("relative transition-all duration-500 ease-in-out h-full", isChatOpen ? "w-[70%]" : "w-full")}>
        <div className="relative w-full h-full flex flex-col">
            
            <div className="flex-1 bg-black flex items-center justify-center p-4 relative">
                 <div className="relative w-full max-w-5xl aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
                    <div ref={containerRef} className="absolute inset-0 w-full h-full" />
                    {!playerReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                            <Loader2 className="w-10 h-10 animate-spin text-lime-500" />
                            <span className="ml-3 text-lime-500 font-mono">Establishing Uplink...</span>
                        </div>
                    )}
                    <AnimatePresence>
                        {activeQuiz && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                                <Card className="w-full max-w-md bg-neutral-900 border-lime-500/30 p-6 shadow-2xl">
                                    <h3 className="text-xl font-bold text-white mb-6">{activeQuiz.question}</h3>
                                    <div className="space-y-3">
                                        {activeQuiz.options.map((opt: string, idx: number) => (
                                            <Button 
                                                key={idx} 
                                                variant="outline" 
                                                className="w-full justify-start text-white border-white/10 hover:bg-lime-500 hover:text-black py-3"
                                                onClick={() => idx === activeQuiz.correct_index ? handleQuizComplete(true) : toast.error("Incorrect.")}
                                            >
                                                <span className="mr-3 border border-current w-6 h-6 rounded-full flex items-center justify-center text-xs">{String.fromCharCode(65 + idx)}</span>
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </AnimatePresence>
                  </div>
            </div>

            {/* Bottom Bar: Mission Intel + Manual Complete Button */}
            <div className="h-48 border-t border-white/10 bg-[#0a0a0a] p-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mission Briefing: {title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{description || "No description available."}</p>
                    </div>

                    {/* MANUAL COMPLETE BUTTON - Added Here */}
                    <div className="flex items-start">
                        <Button 
                            onClick={handleVideoEnd} 
                            disabled={isCompleting}
                            className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-6 rounded-xl shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all hover:scale-105"
                        >
                            {isCompleting ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            )}
                            {isCompleting ? "Syncing..." : "Complete & Continue"}
                            {!isCompleting && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {!isChatOpen && (
            <Button onClick={() => setIsChatOpen(true)} className="absolute top-6 right-6 z-10 bg-lime-500/10 text-lime-400 hover:bg-lime-500 hover:text-black rounded-full px-4 gap-2">
                <MessageSquare className="w-4 h-4" /> Copilot
            </Button>
        )}
      </div>

      {/* RIGHT: COPILOT SIDEBAR */}
      <AnimatePresence>
        {isChatOpen && (
            <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                className="w-[30%] h-full border-l border-white/10 bg-[#131314] flex flex-col absolute right-0 top-0 z-20 shadow-2xl"
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                    <span className="font-bold text-white">SkillNova Live</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                        <X className="w-5 h-5 text-white" />
                    </Button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-gray-500 text-sm mt-10">
                            <p>I have analyzed the transcript for <strong>{title}</strong>.</p>
                            <p className="mt-2">Ask me to explain concepts or generate code!</p>
                        </div>
                    )}
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={cn("p-3 rounded-lg text-sm max-w-[90%]", 
                            msg.role === 'user' ? "bg-white/10 ml-auto text-white" : "bg-lime-500/10 text-lime-300 mr-auto border border-lime-500/20")}>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && <div className="text-xs text-lime-500 animate-pulse ml-2">SkillNova is thinking...</div>}
                </div>

                <div className="p-4 bg-[#1a1a1a] border-t border-white/10">
                    <form className="relative" onSubmit={async (e) => {
                        e.preventDefault();
                        if (!chatInput.trim()) return;
                        const msg = chatInput;
                        setChatHistory(p => [...p, { role: 'user', text: msg }]);
                        setChatInput("");
                        setIsTyping(true);

                        try {
                            const res = await fetch('/api/copilot', {
                                method: 'POST',
                                body: JSON.stringify({ message: msg, context: title })
                            });
                            const data = await res.json();
                            setChatHistory(p => [...p, { role: 'ai', text: data.reply }]);
                        } catch (err) {
                            setChatHistory(p => [...p, { role: 'ai', text: "Connection failed. Try again." }]);
                        } finally {
                            setIsTyping(false);
                        }
                    }}>
                        <Input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask AI..." 
                            className="bg-black/50 border-white/10 text-white pr-10 focus-visible:ring-lime-500/50"
                        />
                        <button type="submit" className="absolute right-2 top-2.5 text-lime-500 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
                    </form>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}