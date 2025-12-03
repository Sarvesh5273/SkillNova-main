"use client";

import { BossMonitor } from "@/components/arena/boss-monitor";
import { CodeChallenge } from "@/components/arena/code-challenge";
import { motion } from "framer-motion";

export default function ArenaPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden font-sans">
      
      {/* 1. THE BOSS MONITOR (Fixed Top) */}
      <BossMonitor />

      {/* 2. THE CHALLENGE AREA */}
      <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-80px)]">
        
        {/* LEFT: PROBLEM STATEMENT */}
        <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-1/3 bg-[#111] border border-white/10 rounded-2xl p-6 overflow-y-auto"
        >
            <h1 className="text-2xl font-bold text-white mb-4">Challenge: Reverse String</h1>
            
            <div className="prose prose-invert prose-sm text-gray-300 space-y-4">
                <p>
                    Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.
                </p>
                <p>
                    You must do this by modifying the input array in-place with O(1) extra memory.
                </p>
                
                <div className="bg-black/50 p-4 rounded-lg border border-white/5 my-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Example 1</h4>
                    <p className="font-mono text-sm"><span className="text-purple-400">Input:</span> s = ["h","e","l","l","o"]</p>
                    <p className="font-mono text-sm"><span className="text-lime-400">Output:</span> ["o","l","l","e","h"]</p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Constraints</h4>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>1 &le; s.length &le; 10^5</li>
                        <li>s[i] is a printable ascii character.</li>
                    </ul>
                </div>
            </div>
        </motion.div>

        {/* RIGHT: CODE EDITOR (The Weapon) */}
        <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-2/3 h-full"
        >
            <CodeChallenge />
        </motion.div>

      </div>
    </div>
  );
}