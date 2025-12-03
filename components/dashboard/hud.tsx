import { Crown, Flame, Hexagon } from "lucide-react";

export function HUD() {
  return (
    // Fixed at top, Full Width (w-full), Pushed to edges (justify-between)
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="w-full px-6 md:px-10 pt-6 pb-4 flex justify-between items-start bg-gradient-to-b from-black via-black/80 to-transparent">
            
            {/* LEFT: Credibility Score */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 pointer-events-auto shadow-lg hover:border-lime-500/50 transition-colors">
                <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center text-lime-400">
                    <Hexagon className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Credibility</p>
                    <p className="text-2xl font-bold text-white leading-none">850</p>
                </div>
            </div>

            {/* RIGHT: XP & Streak */}
            <div className="flex gap-4 pointer-events-auto">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-lg hover:border-orange-500/50 transition-colors">
                    <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                    <div className="hidden md:block">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Streak</p>
                        <span className="text-white font-bold leading-none text-lg">12 Days</span>
                    </div>
                    <span className="md:hidden text-white font-bold text-lg">12</span>
                </div>
                
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-lg hover:border-yellow-500/50 transition-colors">
                    <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <div className="hidden md:block">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Level</p>
                        <span className="text-white font-bold leading-none text-lg">5</span>
                    </div>
                    <span className="md:hidden text-white font-bold text-lg">Lvl 5</span>
                </div>
            </div>
        </div>
    </div>
  );
}