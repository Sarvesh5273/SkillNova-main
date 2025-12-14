import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Code2, Download, ExternalLink, Trophy, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";

// Mock Data Fetcher (Replace with Supabase later)
async function getProfileData(username: string) {
  // Simulate DB Delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // For now, return dummy data based on URL
  return {
    username: decodeURIComponent(username),
    role: "Full Stack Architect",
    level: 12,
    skills: [
        { name: "React.js", level: "Advanced", score: 92 },
        { name: "Next.js", level: "Intermediate", score: 78 },
        { name: "Node.js", level: "Advanced", score: 88 },
    ]
  };
}

interface PageProps {
  params: { username: string }
}

export default async function ProfilePage({ params }: PageProps) {
  const profile = await getProfileData(params.username);

  if (!profile) return notFound();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-500/30">
      <SiteHeader />
      
      <main className="max-w-5xl mx-auto pt-32 pb-12 px-4">
        
        {/* Optimized Header (Reduced Blur Lag) */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
                {/* CSS Shadow is faster than Blur Filter */}
                <div className="absolute inset-0 rounded-full bg-lime-500/20 shadow-[0_0_40px_rgba(132,204,22,0.3)]" />
                
                <Avatar className="w-32 h-32 border-4 border-lime-500 relative z-10">
                    <AvatarImage src={`https://github.com/${profile.username}.png`} />
                    <AvatarFallback>{profile.username.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="absolute -bottom-3 -right-3 z-20 bg-black border border-lime-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Trophy className="w-3.5 h-3.5 text-lime-400 fill-current" />
                    <span className="text-xs font-bold text-lime-400 uppercase tracking-wide">Lvl {profile.level}</span>
                </div>
            </div>
            
            <div className="flex-1 space-y-3">
                <div className="space-y-1">
                    <h1 className="text-5xl font-bold tracking-tight capitalize">{profile.username}</h1>
                    <p className="text-gray-400 text-xl font-light">{profile.role}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-lime-500/50 text-lime-400 bg-lime-500/5 px-3 py-1">
                        <Zap className="w-3 h-3 mr-1.5" /> Top 5% Algo Rank
                    </Badge>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                    <Download className="w-4 h-4" /> PDF
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-400 text-black font-bold gap-2 px-6">
                    Hire Me
                </Button>
            </div>
        </div>

        {/* Optimized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-5 h-5 text-lime-500" /> Verified Skills
                </h2>
                <Card className="bg-[#0a0a0a] border-white/10 p-1">
                    <div className="divide-y divide-white/5">
                        {profile.skills.map((skill) => (
                            <div key={skill.name} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div>
                                    <div className="font-medium text-sm">{skill.name}</div>
                                    <div className="h-1 w-24 bg-gray-800 rounded-full mt-1.5">
                                        <div className="h-full bg-lime-500" style={{ width: `${skill.score}%` }} />
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-gray-400">{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                    <Code2 className="w-5 h-5 text-purple-500" /> Recent Activity
                </h2>
                <Card className="bg-[#0a0a0a] border-white/10 p-6 hover:border-lime-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-lg font-bold text-white">Valid Parentheses (Stack)</h3>
                         <Badge className="bg-lime-500/20 text-lime-400 border-0 text-[10px]">Passed</Badge>
                    </div>
                    <p className="text-sm text-gray-400">Solved in 42ms (Faster than 92% of users)</p>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}