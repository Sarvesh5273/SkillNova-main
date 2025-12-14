"use client";

import { Lock, RefreshCw } from "lucide-react";

export function RemedialNodeCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto mt-8 group cursor-pointer">
      {/* Glitch/Holo Effect Border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-200 animate-pulse" />
      
      <div className="relative bg-black rounded-xl p-6 border border-red-500/50 flex items-center gap-4">
        {/* Icon */}
        <div className="h-12 w-12 rounded-full bg-red-900/30 flex items-center justify-center border border-red-500/50">
           <RefreshCw className="w-6 h-6 text-red-400" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <h4 className="text-red-400 font-bold text-sm tracking-widest uppercase">Adaptive Intervention</h4>
             <Lock className="w-3 h-3 text-red-500" />
          </div>
          <p className="text-white font-bold text-lg">Understanding `useEffect`</p>
          <p className="text-gray-400 text-xs mt-1">
            Detected confusion in previous quiz. Complete this to unlock Main Track.
          </p>
        </div>
      </div>
    </div>
  );
}