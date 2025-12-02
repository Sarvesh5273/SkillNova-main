"use client";

import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, LogOut, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingsDialog } from "@/components/settings-dialog";
import type { User } from "@supabase/supabase-js"; // Import correct type

export default function UserDashboardPage() {
  const [user, setUser] = useState<User | null>(null); // Use proper type
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect if not logged in
        router.push("/");
        return;
      }

      setUser(user);
      setIsLoading(false);
    };
    getUser();
  }, [router, supabase]); // Added dependencies

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Using your custom lime color for the spinner */}
        <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {/* Safely access user metadata or fallback to email */}
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}!
            </h1>
            <p className="text-gray-400">Manage your SkillNova experience</p>
          </div>

          {/* Plan Card */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-lime-400" />
                <CardTitle className="text-white">SkillNova Free Plan</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Upgrade for unlimited mentorship and premium roadmaps
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/pricing">
                <Button className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold transition-colors">
                    Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Menu Options */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                <button className="w-full text-left" onClick={() => setIsSettingsOpen(true)}>
                  <div className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Settings</span>
                  </div>
                </button>

                <Link href="/faq" className="block">
                  <div className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Help & FAQ</span>
                  </div>
                </Link>

                <button className="w-full text-left" onClick={handleLogout}>
                  <div className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Logout</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link href="/chat">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 bg-transparent">
                Back to Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}