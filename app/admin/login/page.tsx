"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // 2. Redirect to Admin Dashboard
      router.push("/admin");

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      {/* Left side - only visible on desktop */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-lime-900 to-black p-12 flex-col justify-between border-r border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">SN</span>
            </div>
            <span className="text-2xl font-semibold text-white">SkillNova</span>
          </div>
          <h1 className="text-4xl font-bold text-white mt-12">Welcome to SkillNova Admin</h1>
          <p className="text-neutral-400 mt-4 max-w-md">
            Manage your career mentorship content, user data, and system settings from one central dashboard.
          </p>
        </div>
        <div className="mt-auto">
           {/* Placeholder for admin visual */}
           <div className="w-full h-48 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-neutral-500">
              Admin Dashboard Preview
           </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile header - only visible on mobile */}
        <div className="flex md:hidden items-center gap-3 mb-8 w-full">
          <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">SN</span>
          </div>
          <span className="text-2xl font-semibold text-white">SkillNova</span>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="text-neutral-400 mt-2">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillnova.ai"
                className="bg-[#1a1a1a] border-neutral-800 text-white focus:border-lime-500/50"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-neutral-200">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#1a1a1a] border-neutral-800 text-white focus:border-lime-500/50"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-lime-500 text-black hover:bg-lime-600 font-semibold">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-neutral-400 text-sm">
              Need help? Contact{" "}
              <a href="mailto:support@skillnova.ai" className="text-lime-400 hover:underline">
                support@skillnova.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}