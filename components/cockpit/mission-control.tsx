"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic"; // Import dynamic
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizOverlay } from "./quiz-overlay";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Dynamically import ReactPlayer to fix SSR and Type issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// --- MOCK DATA FOR DEMO ---
const VIDEO_URL = "https://www.youtube.com/watch?v=hdI2bqOjy3c"; // JS Crash Course
const QUIZZES = [
  {
    time: 10,
    question: "What is the correct way to declare a variable in ES6?",
    options: ["var myVar", "let myVar", "variable myVar", "dim myVar"],
    correct: 1,
    type: "MID_ROLL" as const,
  },
];

export function MissionControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<typeof QUIZZES[0] | null>(null);
  const [takenQuizzes, setTakenQuizzes] = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  
  const playerRef = useRef<any>(null);

  const handleProgress = (progress: any) => {
    const { playedSeconds } = progress;
    const currentTime = Math.floor(playedSeconds);
    const quizDue = QUIZZES.find(q => q.time === currentTime && !takenQuizzes.includes(q.time));

    if (quizDue) {
      setIsPlaying(false); // PAUSE
      setActiveQuiz(quizDue); // SHOW QUIZ
    }
  };

  const handleQuizComplete = (success: boolean) => {
    if (success && activeQuiz) {
      setTakenQuizzes([...takenQuizzes, activeQuiz.time]);
      setActiveQuiz(null);
      setIsPlaying(true); // RESUME
    }
  };

  // We cast the component to 'any' to bypass the specific TypeScript error
  const VideoPlayer = ReactPlayer as any;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-black relative">
      
      {/* LEFT: MAIN VIEWPORT (Video) */}
      <div className={cn("relative transition-all duration-500 ease-in-out h-full", isChatOpen ? "w-[70%]" : "w-full")}>
        
        {/* The Video Container */}
        <div className="relative w-full h-full flex flex-col">
            <div className="flex-1 relative bg-black">
                {/* Use the casted component */}
                <VideoPlayer
                    ref={playerRef}
                    url={VIDEO_URL}
                    playing={isPlaying}
                    controls={true}
                    width="100%"
                    height="100%"
                    onProgress={handleProgress}
                    onEnded={() => alert("Mission Complete!")}
                    config={{
                        youtube: { playerVars: { showinfo: 0, modestbranding: 1 } }
                    }}
                />
                
                <AnimatePresence>
                    {activeQuiz && (
                        <QuizOverlay 
                            question={activeQuiz.question}
                            options={activeQuiz.options}
                            correctAnswer={activeQuiz.correct}
                            type={activeQuiz.type}
                            onComplete={handleQuizComplete}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Bar: Key Intel */}
            <div className="h-48 border-t border-white/10 bg-[#0a0a0a] p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Intel Stream</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-400 font-mono">
                    <p><span className="text-lime-500">[00:00]</span> Initialization sequence...</p>
                    <p><span className="text-lime-500">[00:10]</span> Variable Types Checkpoint reached.</p>
                    <p className="opacity-50">... Awaiting further data</p>
                </div>
            </div>
        </div>

        {/* Chat Trigger Button */}
        {!isChatOpen && (
            <Button 
                onClick={() => setIsChatOpen(true)}
                className="absolute top-6 right-6 z-10 bg-lime-500/10 text-lime-400 hover:bg-lime-500 hover:text-black border border-lime-500/50 backdrop-blur-md rounded-full px-4 gap-2 shadow-lg"
            >
                <MessageSquare className="w-4 h-4" />
                <span>Ask SkillNova</span>
            </Button>
        )}
      </div>

      {/* RIGHT: SKILLNOVA COPILOT */}
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

                <div className="flex-1 p-4 overflow-y-auto bg-black/20">
                    <div className="text-center mt-10 text-gray-500 text-sm">
                        <p>I am monitoring your mission.</p>
                        <p>Ask me to explain any concept.</p>
                    </div>
                </div>

                <div className="p-4 bg-[#1a1a1a] border-t border-white/10">
                    <form className="relative">
                        <Input 
                            placeholder="Explain this concept..." 
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