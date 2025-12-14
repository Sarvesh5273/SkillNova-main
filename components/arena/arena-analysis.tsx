"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface AnalysisProps {
  success: boolean;
  topic: string;
  executionTime: string;
  onRetry: () => void;
}

export function ArenaAnalysis({ success, topic, executionTime, onRetry }: AnalysisProps) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className={`p-8 text-center border-b ${success ? 'bg-lime-500/10 border-lime-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <div className="flex justify-center mb-4">
            {success ? (
                <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.4)]">
                    <CheckCircle className="w-10 h-10 text-black" />
                </div>
            ) : (
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    <XCircle className="w-10 h-10 text-white" />
                </div>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{success ? "Challenge Conquered" : "Execution Failed"}</h2>
          <p className="text-gray-400">Performance Report Generated</p>
        </div>

        {/* Analytics Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Performance Metrics</h3>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-gray-300">Runtime</span>
                    <span className="font-mono text-lime-400">{executionTime}ms</span>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-gray-300">Memory</span>
                    <span className="font-mono text-blue-400">O(1)</span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Skill Analysis</h3>
                {success ? (
                    <div className="bg-lime-500/5 p-4 rounded-xl border border-lime-500/20">
                        <div className="flex items-center gap-2 mb-2 text-lime-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-bold">Strength Detected</span>
                        </div>
                        <p className="text-sm text-gray-400">You demonstrated strong logic in <strong>{topic}</strong>. Recommended next step: Advanced Algorithms.</p>
                    </div>
                ) : (
                    <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2 text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-bold">Optimization Needed</span>
                        </div>
                        <p className="text-sm text-gray-400">Logic error detected in <strong>{topic}</strong>. Review string manipulation methods.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#0a0a0a] border-t border-white/10 flex justify-between">
            <Button variant="ghost" onClick={onRetry} className="text-gray-400 hover:text-white">
                Retry Challenge
            </Button>
            {success && (
                <Button onClick={() => router.push('/dashboard')} className="bg-lime-500 hover:bg-lime-400 text-black font-bold">
                    Return to Map <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            )}
        </div>
      </motion.div>
    </div>
  );
}