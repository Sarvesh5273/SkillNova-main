"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TechCards } from "./tech-cards";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // <--- THIS WAS MISSING

type ViewState = "VOID" | "CHAT" | "DISCOVERY" | "TRANSITION";

export function OriginStory() {
  const [viewState, setViewState] = useState<ViewState>("VOID");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const router = useRouter();
  
  // 1. Initial "Void" Timer
  useEffect(() => {
    const timer = setTimeout(() => setViewState("CHAT"), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Handle User Input
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    // Simple routing logic (In prod, send this to your API)
    if (userMsg.toLowerCase().includes("know") || userMsg.toLowerCase().includes("trend") || userMsg.toLowerCase().includes("sure")) {
        // Trigger Path B: Discovery
        setTimeout(() => {
            setMessages((prev) => [...prev, { role: "ai", text: "Analyzing current tech vectors... Accessing global trend data." }]);
            setTimeout(() => setViewState("DISCOVERY"), 1500);
        }, 800);
    } else {
        // Trigger Path A: Direct
        setTimeout(() => {
            setMessages((prev) => [...prev, { role: "ai", text: `Excellent choice. High demand detected. Initializing '${userMsg}' trajectory...` }]);
            setTimeout(() => setViewState("TRANSITION"), 2000);
        }, 1000);
    }
  };

  // 3. Handle Card Selection
  const handleCardSelect = (path: string) => {
    setMessages((prev) => [...prev, { role: "user", text: `I choose ${path}` }]);
    setViewState("CHAT"); // Briefly go back to chat to show confirmation
    setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", text: `Understood. ${path} path selected. Generating roadmap...` }]);
        setTimeout(() => setViewState("TRANSITION"), 1500);
    }, 500);
  };

  // 4. Handle "Big Bang" Transition (End of Onboarding)
  useEffect(() => {
    if (viewState === "TRANSITION") {
        // Wait for animation, then push to dashboard/map
        setTimeout(() => router.push("/dashboard"), 2500); 
    }
  }, [viewState, router]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden">
      
      {/* STATE 1: THE VOID (Pulsing Star) */}
      <AnimatePresence>
        {viewState === "VOID" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 h-32 md:w-48 md:h-48">
                {/* Core Star */}
                <div className="absolute inset-0 bg-white rounded-full blur-[50px] animate-pulse opacity-50" />
                <Image 
                    src="/icons/skillnova2.png" 
                    alt="SkillNova" 
                    fill 
                    className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
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
            className="w-full max-w-3xl flex flex-col items-center"
        >
            {/* Chat History (Centered) */}
            <div className="flex flex-col items-center gap-6 mb-12 w-full">
                {messages.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
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
                            "max-w-xl p-4 rounded-2xl backdrop-blur-sm",
                            msg.role === "ai" 
                                ? "bg-white/5 border border-white/10 text-gray-200" 
                                : "bg-lime-500/10 border border-lime-500/20 text-lime-100 self-end"
                        )}
                    >
                        {msg.text}
                    </motion.div>
                ))}
            </div>

            {/* Input Area (Only visible in CHAT mode) */}
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
                        className="h-14 pl-6 pr-14 rounded-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-lime-500/50 text-lg backdrop-blur-xl"
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

            {/* Tech Radar Cards (Only in DISCOVERY mode) */}
            {viewState === "DISCOVERY" && (
                <TechCards onSelect={handleCardSelect} />
            )}
        </motion.div>
      )}

      {/* STATE 4: TRANSITION (The Big Bang) */}
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
                        transition={{ duration: 2, ease: "easeIn" }}
                        className="w-4 h-4 bg-white rounded-full blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: [0, 30], opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="absolute inset-0 w-4 h-4 bg-lime-400 rounded-full blur-xl"
                    />
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}