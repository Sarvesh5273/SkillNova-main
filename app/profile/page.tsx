import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Code2, Download, Trophy, Zap, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default async function ProfilePage() {
  // 1. FIXED: Add 'await' here because createClient() is async
  const supabase = await createClient(); 
  
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Security: Redirect if not logged in
  if (!user) {
    redirect("/");
  }

  // 3. Get Details (Fallback to metadata if DB fetch fails)
  const displayName = user.user_metadata?.full_name || "Anonymous User";
  const email = user.email || "No Email";
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = email.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-500/30">
      <SiteHeader />
      
      <main className="max-w-5xl mx-auto pt-32 pb-12 px-4">
        
        {/* 1. Hero / Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 animate-in slide-in-from-bottom-4 duration-700">
            <div className="relative group">
                <div className="absolute inset-0 bg-lime-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <Avatar className="w-32 h-32 border-4 border-lime-500 shadow-2xl relative z-10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-lime-900 text-lime-400 text-3xl font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 z-20 bg-black border border-lime-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Trophy className="w-3.5 h-3.5 text-lime-400 fill-current" />
                    <span className="text-xs font-bold text-lime-400 uppercase tracking-wide">Lvl 1</span>
                </div>
            </div>
            
            <div className="flex-1 space-y-3">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        {displayName}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-400 text-lg font-light">
                        <Mail className="w-4 h-4" /> {email}
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-lime-500/50 text-lime-400 bg-lime-500/5 px-3 py-1">
                        <Zap className="w-3 h-3 mr-1.5" /> Explorer Rank
                    </Badge>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                    <Download className="w-4 h-4" /> Resume PDF
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-400 text-black font-bold gap-2 px-6">
                    Edit Profile
                </Button>
            </div>
        </div>

        {/* 2. Main Grid (Static Placeholders for now) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Col: Skills */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-5 h-5 text-lime-500" /> Current Stats
                </h2>
                <Card className="bg-[#111] border-white/10 p-4">
                    <p className="text-gray-400 text-sm mb-4">
                        Your skills will appear here once you complete your first Mission in the Arena.
                    </p>
                    <Button variant="secondary" className="w-full text-xs">Go to Arena</Button>
                </Card>
            </div>

            {/* Right Col: Activity */}
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                    <Code2 className="w-5 h-5 text-purple-500" /> Recent Activity
                </h2>
                
                <Card className="bg-[#111] border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                    <Trophy className="w-12 h-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-white">No Missions Completed Yet</h3>
                    <p className="text-gray-400 max-w-sm mt-2">
                        Start your journey in the Dashboard to earn badges and verified skills.
                    </p>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}