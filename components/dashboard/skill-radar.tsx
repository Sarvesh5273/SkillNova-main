"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for UI Dev
const MOCK_SKILLS = [
  { name: "React Hooks", score: 85, status: "MASTERED" },
  { name: "Async/Await", score: 42, status: "WEAK" },
  { name: "PostgreSQL", score: 65, status: "GROWING" },
  { name: "System Design", score: 10, status: "WEAK" },
];

export function SkillRadar() {
  const weakSkills = MOCK_SKILLS.filter((s) => s.status === "WEAK");

  return (
    <div className="w-full bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Zap className="w-4 h-4 text-lime-400 fill-current" />
          Skill Vitality
        </h3>
        <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
          LIVE MONITOR
        </span>
      </div>

      {/* 1. The Alert Section (Adaptive Engine Trigger) */}
      {weakSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex flex-col gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-red-200 text-sm font-bold">Critical Weakness Detected</p>
              <p className="text-red-400 text-xs mt-1 leading-relaxed">
                Proficiency in <span className="text-white font-mono">{weakSkills[0].name}</span> has dropped below threshold.
              </p>
            </div>
          </div>
          
          <button className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2">
            Initialize Remedial Module <TrendingUp className="w-3 h-3" />
          </button>
        </motion.div>
      )}

      {/* 2. The Skill Bars */}
      <div className="space-y-4">
        {MOCK_SKILLS.map((skill, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between text-xs mb-1">
              <span className={cn("font-medium", 
                skill.status === "WEAK" ? "text-red-300" : "text-gray-300"
              )}>
                {skill.name}
              </span>
              <span className="font-mono text-gray-500">{skill.score}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.score}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", 
                  skill.status === "MASTERED" ? "bg-lime-500 shadow-lime-500/50" :
                  skill.status === "WEAK" ? "bg-red-500 shadow-red-500/50" :
                  "bg-blue-500 shadow-blue-500/50"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}