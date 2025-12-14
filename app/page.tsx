import { createClient } from "@/lib/supabase/server"; 
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LoginDialog } from "@/components/login-dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TypingEffect } from "@/components/typing-effect";

export default async function LandingPage() {
  // 1. Auth Check
  const supabase = await createClient(); 
  const { data: { user } } = await supabase.auth.getUser();

  // 2. If User is Logged In -> Go to Dashboard
  if (user) {
    redirect("/dashboard");
  }

  // 3. Public Hero Page
  return (
    <>
      <div className="fixed inset-0 z-0 bg-black">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" /> 
      </div>
      
      <main className="relative min-h-[100dvh] text-white selection:bg-lime-500/30">
        <SiteHeader />

        {/* FIX APPLIED: Added pt-32 (mobile) and md:pt-40 (desktop) to prevent Navbar overlap */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-32 md:pt-40">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            <span className="text-xs font-mono text-lime-400 tracking-widest uppercase">System Online // Year 2050</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 animate-in fade-in zoom-in-50 duration-1000">
            INITIATE YOUR <br/>
            <span className="text-lime-400">
              <TypingEffect 
                words={["CAREER SEQUENCE", "FUTURE PROTOCOL", "SUCCESS PATH"]} 
                speed={100}
              />
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            SkillNova is the first AI-driven Career Architecture Platform. 
            Stop guessing your future. Build it with precision engineering.
          </p>

          <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <LoginDialog>
              <Button className="h-14 px-8 rounded-full bg-lime-500 hover:bg-lime-400 text-black text-lg font-bold shadow-[0_0_40px_rgba(132,204,22,0.4)] hover:shadow-[0_0_60px_rgba(132,204,22,0.6)] transition-all">
                Start Mission <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </LoginDialog>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}