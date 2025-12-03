"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit, Timer, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BossMonitor() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 Minutes
  const [status, setStatus] = useState("MONITORING");

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-[#111] border-b border-red-500/20 p-4 flex items-center justify-between shadow-[0_10px_40px_-10px_rgba(239,68,68,0.2)] relative overflow-hidden">
      
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 bg-red-500/5 animate-pulse z-0" />

      {/* LEFT: THE BOSS AVATAR */}
      <div className="flex items-center gap-4 z-10">
        <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Pulsing Rings */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-red-500"
            />
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 rounded-full border border-dashed border-orange-500"
            />
            <BrainCircuit className="w-6 h-6 text-red-500 relative z-10" />
        </div>
        <div>
            <h2 className="text-white font-bold uppercase tracking-widest text-sm">Gatekeeper AI</h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs text-red-400 font-mono">{status}...</span>
            </div>
        </div>
      </div>

      {/* CENTER: STATUS TEXT (Typewriter effect could go here) */}
      <div className="hidden md:block z-10">
        <div className="bg-red-950/30 border border-red-500/20 px-4 py-1 rounded-full flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-orange-200 text-xs font-mono">LIVE INTERVIEW ENVIRONMENT</span>
        </div>
      </div>

      {/* RIGHT: TIMER */}
      <div className="flex items-center gap-3 z-10">
        <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Time Remaining</p>
            <p className={cn("text-2xl font-mono font-bold leading-none", 
                timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"
            )}>
                {formatTime(timeLeft)}
            </p>
        </div>
        <Timer className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
}