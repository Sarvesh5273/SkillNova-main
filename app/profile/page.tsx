import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Code2, Download, ExternalLink, Github, Trophy, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-500/30">
      <SiteHeader />
      
      <main className="max-w-5xl mx-auto pt-32 pb-12 px-4">
        
        {/* 1. Hero / Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 animate-in slide-in-from-bottom-4 duration-700">
            <div className="relative group">
                <div className="absolute inset-0 bg-lime-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <Avatar className="w-32 h-32 border-4 border-lime-500 shadow-2xl relative z-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 z-20 bg-black border border-lime-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Trophy className="w-3.5 h-3.5 text-lime-400 fill-current" />
                    <span className="text-xs font-bold text-lime-400 uppercase tracking-wide">Lvl 12</span>
                </div>
            </div>
            
            <div className="flex-1 space-y-3">
                <div className="space-y-1">
                    <h1 className="text-5xl font-bold tracking-tight">Sarvesh Developer</h1>
                    <p className="text-gray-400 text-xl font-light">Full Stack Architect • 3rd Year Student</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-lime-500/50 text-lime-400 bg-lime-500/5 px-3 py-1">
                        <Zap className="w-3 h-3 mr-1.5" /> Top 5% Algo Rank
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/5 px-3 py-1">
                        Consistent Learner (30 Day Streak)
                    </Badge>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                    <Download className="w-4 h-4" /> Resume PDF
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-400 text-black font-bold gap-2 px-6">
                    Hire Me
                </Button>
            </div>
        </div>

        {/* 2. Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Col: Verified Skills */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-5 h-5 text-lime-500" /> Verified Skills
                </h2>
                <Card className="bg-[#111] border-white/10 p-1 overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {[
                            { name: "React.js", level: "Advanced", color: "text-blue-400", score: 92 },
                            { name: "Next.js", level: "Intermediate", color: "text-white", score: 78 },
                            { name: "Node.js", level: "Advanced", color: "text-green-400", score: 88 },
                            { name: "Python", level: "Basic", color: "text-yellow-400", score: 45 },
                        ].map((skill) => (
                            <div key={skill.name} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors group cursor-default">
                                <div>
                                    <div className="font-medium text-sm group-hover:text-lime-400 transition-colors">{skill.name}</div>
                                    <div className="h-1 w-24 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full bg-lime-500/50" style={{ width: `${skill.score}%` }} />
                                    </div>
                                </div>
                                <span className={`text-xs font-mono font-bold ${skill.color}`}>{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right Col: The "Arena" Wins (Proof of Work) */}
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                    <Code2 className="w-5 h-5 text-purple-500" /> Featured Challenges
                </h2>
                
                {/* Challenge Card 1 */}
                <Card className="bg-[#111] border-white/10 p-6 group hover:border-lime-500/30 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                         <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white" />
                    </div>
                    
                    <div className="mb-4">
                        <div className="flex items-center gap-3 mb-1">
                             <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors">
                                Valid Parentheses (Stack)
                            </h3>
                            <Badge className="bg-lime-500/20 text-lime-400 hover:bg-lime-500/30 border-0 text-[10px]">Passed</Badge>
                        </div>
                        <p className="text-sm text-gray-400">Solved in <span className="text-white font-mono">42ms</span> <span className="text-lime-500 text-xs ml-1">(Faster than 92% of users)</span></p>
                    </div>
                    
                    {/* Code Snippet Preview */}
                    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="flex justify-between text-gray-600 mb-2 select-none">
                            <span>solution.js</span>
                            <span>javascript</span>
                        </div>
                        <pre className="opacity-80 group-hover:opacity-100 transition-opacity">{`function isValid(s) {
  const stack = [];
  const map = { "(": ")", "{": "}", "[": "]" };
  for (let char of s) {
    if (map[char]) stack.push(map[char]);
    else if (stack.pop() !== char) return false;
  }
  return stack.length === 0;
}`}</pre>
                    </div>
                </Card>

                 {/* Challenge Card 2 */}
                 <Card className="bg-[#111] border-white/10 p-6 group hover:border-lime-500/30 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors">
                                    API Rate Limiter
                                </h3>
                                <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-0 text-[10px]">System Design</Badge>
                            </div>
                            <p className="text-sm text-gray-400">Implemented Token Bucket algorithm using Redis.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}