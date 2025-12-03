"use client";

import { motion } from "framer-motion";
import { Lock, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeStatus = "LOCKED" | "ACTIVE" | "COMPLETED";

interface SkillNodeProps {
  id: string;
  title: string;
  status: NodeStatus;
  x: number; // Percentage (0-100) for responsive positioning
  y: number; // Percentage (0-100)
  onClick?: () => void;
}

export function SkillNode({ title, status, x, y, onClick }: SkillNodeProps) {
  return (
    <div 
      className="absolute flex flex-col items-center z-10"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {/* THE PLANET/STAR */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={status !== "LOCKED" ? onClick : undefined}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-500",
          // Size & Color Logic
          status === "ACTIVE" ? "w-16 h-16 bg-lime-500 shadow-[0_0_30px_rgba(198,255,58,0.6)]" : 
          status === "COMPLETED" ? "w-12 h-12 bg-white border-2 border-lime-400 shadow-[0_0_15px_rgba(255,255,255,0.5)]" :
          "w-10 h-10 bg-white/10 border border-white/20 cursor-not-allowed" // Locked
        )}
      >
        {/* Active Planet Rings Animation */}
        {status === "ACTIVE" && (
          <>
            <div className="absolute inset-0 rounded-full border border-lime-500 animate-ping opacity-20" />
            <div className="absolute -inset-2 rounded-full border border-lime-500/30 animate-pulse" />
          </>
        )}

        {/* Icon */}
        {status === "LOCKED" && <Lock className="w-4 h-4 text-gray-500" />}
        {status === "COMPLETED" && <Check className="w-6 h-6 text-black font-bold" />}
        {status === "ACTIVE" && <Star className="w-8 h-8 text-black fill-black animate-pulse" />}
      </motion.button>

      {/* LABEL (Title) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "mt-3 px-3 py-1 rounded-lg backdrop-blur-md text-sm font-semibold whitespace-nowrap border",
          status === "ACTIVE" ? "bg-lime-500/10 border-lime-500/50 text-lime-400" :
          status === "COMPLETED" ? "bg-white/10 border-white/20 text-white" :
          "bg-black/40 border-white/5 text-gray-500"
        )}
      >
        {title}
      </motion.div>
    </div>
  );
}