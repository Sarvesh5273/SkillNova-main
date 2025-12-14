"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TechCards } from "./tech-cards";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { selectTrack } from "@/app/actions/onboarding";

type ViewState = "VOID" | "CHAT" | "DISCOVERY" | "TRANSITION";

// Helper function to interpret user intent
const determineTrack = (input: string): string => {
  const text = input.toLowerCase();
  
  if (text.includes("back") || text.includes("data") || text.includes("sql") || text.includes("node") || text.includes("api") || text.includes("server")) {
    return "The Architect";
  }
  if (text.includes("ai") || text.includes("ml") || text.includes("robot") || text.includes("python") || text.includes("model") || text.includes("data science")) {
    return "The Innovator";
  }
  return "The Creator";
};

export function OriginStory() {
  const [viewState, setViewState] = useState<ViewState>("VOID");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => setViewState("CHAT"), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    if (userMsg.toLowerCase().includes("know") || userMsg.toLowerCase().includes("trend") || userMsg.toLowerCase().includes("sure")) {
        setTimeout(() => {
            setMessages((prev) => [...prev, { role: "ai", text: "Analyzing current tech vectors... Accessing global trend data." }]);
            setTimeout(() => setViewState("DISCOVERY"), 1500);
        }, 800);
    } else {
        const selectedTrack = determineTrack(userMsg);
        setMessages((prev) => [...prev, { role: "ai", text: `Excellent choice. High demand detected. Initializing '${selectedTrack}' trajectory...` }]);
        setViewState("TRANSITION");
        
        const result = await selectTrack(selectedTrack);
        
        if (result.success) {
            setTimeout(() => router.push("/dashboard"), 2000); // Reduced delay
        } else {
            console.error("Failed to start track:", result.error);
            setTimeout(() => router.push("/dashboard"), 2000);
        }
    }
  };

  const handleCardSelect = async (path: string) => {
    setMessages((prev) => [...prev, { role: "user", text: `I choose ${path}` }]);
    setViewState("TRANSITION");
    
    const result = await selectTrack(path);
    
    if (result.success) {
        setTimeout(() => router.push("/dashboard"), 2000);
    } else {
        console.error("Failed to start track:", result.error);
        setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden">
      
      {/* STATE 1: THE VOID (Pulsing Star) */}
      <AnimatePresence>
        {viewState === "VOID" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }} // Removed blur filter on exit
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center will-change-transform"
          >
            <div className="relative w-32 h-32 md:w-48 md:h-48">
                {/* Core Star - Reduced blur radius for performance */}
                <div className="absolute inset-0 bg-white rounded-full opacity-30 animate-pulse" style={{ filter: 'blur(20px)' }} />
                <Image 
                    src="/icons/skillnova2.png" 
                    alt="SkillNova" 
                    fill 
                    className="object-contain"
                />
            </div>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white font-light tracking-[0.2em]"
            >
                IGNITE YOUR CAREER
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE 2 & 3: CHAT & DISCOVERY */}
      {(viewState === "CHAT" || viewState === "DISCOVERY") && (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl flex flex-col items-center will-change-transform"
        >
            {/* Chat History */}
            <div className="flex flex-col items-center gap-6 mb-12 w-full">
                {messages.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                            <Sparkles className="w-8 h-8 text-lime-400 animate-pulse" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Welcome, Traveler.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
                            To generate your unique career star-chart, I need to know your destination. 
                            Do you have a role in mind, or should we scan the current tech landscape?
                        </p>
                    </motion.div>
                )}

                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "max-w-xl p-4 rounded-2xl",
                            // Replaced heavy backdrop-blur with simple opacity bg
                            msg.role === "ai" 
                                ? "bg-zinc-900/90 border border-white/10 text-gray-200" 
                                : "bg-lime-900/40 border border-lime-500/20 text-lime-100 self-end"
                        )}
                    >
                        {msg.text}
                    </motion.div>
                ))}
            </div>

            {/* Input Area */}
            {viewState === "CHAT" && (
                <motion.form 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative w-full max-w-xl"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="E.g. 'I want to be a MERN Developer' or 'I'm not sure'"
                        // Reduced blur here too
                        className="h-14 pl-6 pr-14 rounded-full bg-zinc-900/80 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-lime-500/50 text-lg"
                        autoFocus
                    />
                    <Button 
                        type="submit" 
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 rounded-full bg-lime-500 hover:bg-lime-400 text-black transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </motion.form>
            )}

            {viewState === "DISCOVERY" && (
                <TechCards onSelect={handleCardSelect} />
            )}
        </motion.div>
      )}

      {/* STATE 4: TRANSITION */}
      <AnimatePresence>
        {viewState === "TRANSITION" && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black"
            >
                <div className="relative">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 50] }}
                        transition={{ duration: 1.5, ease: "easeIn" }} // Faster transition
                        className="w-4 h-4 bg-white rounded-full" // Removed blur for performance
                    />
                    <motion.div 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: [0, 30], opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                        className="absolute inset-0 w-4 h-4 bg-lime-400 rounded-full opacity-50"
                    />
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}