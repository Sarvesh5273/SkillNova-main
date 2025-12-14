"use client";

import { Lock, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RemedialCard() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12 relative group animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Holo Border Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl opacity-50 group-hover:opacity-100 blur transition duration-500 animate-pulse" />
      
      <div className="relative bg-black rounded-2xl p-6 border border-red-500/30 flex items-center gap-6">
        {/* Icon */}
        <div className="h-14 w-14 rounded-full bg-red-950/50 flex items-center justify-center border border-red-500/50 shrink-0">
           <RefreshCw className="w-7 h-7 text-red-500 animate-spin-slow" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold tracking-widest uppercase border border-red-500/20">
                Adaptive Intervention
             </span>
             <Lock className="w-3 h-3 text-red-500" />
          </div>
          <h4 className="text-white font-bold text-xl">Module: React `useEffect` Mastery</h4>
          <p className="text-gray-400 text-sm mt-1">
            AI detected confusion in the previous quiz. Complete this remedial node to unlock the main track.
          </p>
        </div>

        {/* Action */}
        <Button className="bg-red-600 hover:bg-red-500 text-white font-bold shrink-0">
            Start Module <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}