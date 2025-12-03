"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  onComplete: (success: boolean) => void;
  type: "MID_ROLL" | "END_GATE";
}

export function QuizOverlay({ question, options, correctAnswer, onComplete, type }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"IDLE" | "CORRECT" | "WRONG">("IDLE");

  const handleSubmit = () => {
    if (selected === null) return;
    
    if (selected === correctAnswer) {
      setStatus("CORRECT");
      setTimeout(() => onComplete(true), 1500); // Wait 1.5s then resume video
    } else {
      setStatus("WRONG");
      // Optional: Add "Confidence" logic here later
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
    >
      <div className="w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className={cn("absolute top-0 left-0 w-full h-1", 
            type === "MID_ROLL" ? "bg-blue-500" : "bg-red-500" // Blue for pause, Red for Boss Gate
        )} />

        <div className="mb-6">
            <span className={cn("text-xs font-bold px-2 py-1 rounded bg-white/10 uppercase tracking-wider", 
                type === "MID_ROLL" ? "text-blue-400" : "text-red-400"
            )}>
                {type === "MID_ROLL" ? "Knowledge Check" : "Final Verification"}
            </span>
            <h2 className="text-2xl font-bold text-white mt-3 leading-tight">{question}</h2>
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => { setStatus("IDLE"); setSelected(idx); }}
              disabled={status === "CORRECT"}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group",
                selected === idx 
                    ? "bg-lime-500/10 border-lime-500 text-white" 
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn("w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono",
                    selected === idx ? "border-lime-500 text-lime-500" : "border-gray-600 text-gray-600"
                )}>
                    {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </span>
              
              {/* Feedback Icons */}
              {status === "CORRECT" && selected === idx && <CheckCircle className="w-5 h-5 text-lime-500" />}
              {status === "WRONG" && selected === idx && <XCircle className="w-5 h-5 text-red-500" />}
            </button>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-8 flex items-center justify-between">
            {status === "WRONG" && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <span>Incorrect. Try again.</span>
                </div>
            )}
            
            <Button 
                onClick={handleSubmit}
                disabled={selected === null || status === "CORRECT"}
                className={cn("ml-auto px-8 rounded-full font-bold transition-all",
                    status === "CORRECT" ? "bg-green-500 text-white" : "bg-lime-500 hover:bg-lime-400 text-black"
                )}
            >
                {status === "CORRECT" ? "Continuing..." : "Confirm Answer"}
            </Button>
        </div>
      </div>
    </motion.div>
  );
}