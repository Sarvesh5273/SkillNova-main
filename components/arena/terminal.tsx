"use client";

import { Terminal as TerminalIcon, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  output: string | null;
  error: string | null;
  isLoading: boolean;
}

export function Terminal({ output, error, isLoading }: TerminalProps) {
  return (
    <div className="w-full h-48 bg-black/80 border-t border-white/10 p-4 font-mono text-sm overflow-y-auto">
      <div className="flex items-center gap-2 mb-3 text-gray-500">
        <TerminalIcon className="w-4 h-4" />
        <span className="uppercase text-xs tracking-wider">Console Output</span>
      </div>

      {isLoading ? (
        <div className="text-lime-500 animate-pulse">Running code...</div>
      ) : error ? (
        <div className="text-red-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <pre className="whitespace-pre-wrap font-mono">{error}</pre>
        </div>
      ) : output ? (
        <div className="text-gray-300 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-lime-500" />
          <pre className="whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      ) : (
        <div className="text-gray-600 italic">Ready to execute...</div>
      )}
    </div>
  );
}