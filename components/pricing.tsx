"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { LoginDialog } from "@/components/login-dialog"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type Feature = { text: string; muted?: boolean }
const ACCENT = "#C6FF3A"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-500" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

type Currency = "INR" | "USD"
const PRICES: Record<Currency, { free: string; pro: string; enterprise: string; save: string }> = {
  INR: { free: "₹0", pro: "₹2,399/-", enterprise: "₹8,199/-", save: "Save 20%" },
  USD: { free: "$0", pro: "$29", enterprise: "$99", save: "Save 20%" },
}

export function Pricing({ currency = "USD" }: { currency: Currency }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);
  
  const handleUpgradeClick = (plan: { name: string; price: string }) => {
    router.push(`/payment?plan=${plan.name}&price=${encodeURIComponent(plan.price)}`);
  };

  const planButton = (plan: { name: string; price: string }) => {
    const commonBtnClass = "w-full cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-black shadow transition-[box-shadow,transform,filter] active:translate-y-[1px]";
    if (loading) return <Button disabled className={`${commonBtnClass} bg-neutral-400`}>Loading...</Button>
    if (user) {
      return (
        <Button className={commonBtnClass} style={{ backgroundColor: ACCENT }} onClick={() => handleUpgradeClick(plan)}>
          Upgrade
        </Button>
      )
    }
    return (
      <LoginDialog plan={plan}>
        <Button className={commonBtnClass} style={{ backgroundColor: ACCENT }}>Get Started</Button>
      </LoginDialog>
    )
  }

  return (
    <section id="pricing" className="text-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(198,255,58,0.12)", color: ACCENT }}>
            Career Mentorship Plans
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple, Transparent Pricing.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400">Choose the perfect plan for your career development journey.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Free Plan */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="relative overflow-hidden rounded-2xl liquid-glass shadow-xl h-full">
              <CardHeader className="space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200">Free</div>
                <div className="flex items-end gap-2 text-neutral-100">
                  <div className="text-xl font-bold tracking-tight">{PRICES[currency].free}</div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">forever</span>
                </div>
                <div className="flex gap-2">{planButton({ name: "Free", price: PRICES[currency].free })}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid gap-2">
                  {["5 mentorship sessions", "Basic career guidance", "Community support"].map((f, i) => (<FeatureItem key={i} text={f} />))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="relative overflow-hidden rounded-2xl liquid-glass shadow-xl h-full border-lime-500/30">
              <div className="absolute right-4 top-11 rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: "#1f1f1f", color: "#d4d4d4" }}>{PRICES[currency].save}</div>
              <CardHeader className="space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200">Pro</div>
                <div className="flex items-end gap-2 text-neutral-100">
                  <div className="text-xl font-bold tracking-tight">{PRICES[currency].pro}</div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">per month</span>
                </div>
                <div className="flex gap-2">{planButton({ name: "Pro", price: PRICES[currency].pro })}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid gap-2">
                  {["Unlimited mentorship", "Premium roadmaps", "Priority support", "Advanced goal tracking"].map((f, i) => (<FeatureItem key={i} text={f} />))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          </motion.div>

          {/* Enterprise */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="relative overflow-hidden rounded-2xl liquid-glass-enhanced shadow-xl h-full">
              <CardHeader className="relative space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200">Enterprise</div>
                <div className="flex items-end gap-2 text-white">
                  <div className="text-xl font-bold tracking-tight">{PRICES[currency].enterprise}</div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">per month</span>
                </div>
                <div className="flex gap-2">{planButton({ name: "Enterprise", price: PRICES[currency].enterprise })}</div>
              </CardHeader>
              <CardContent className="relative pt-0">
                <ul className="grid gap-2">
                  {["Custom AI models", "24/7 dedicated consultants", "Team analytics", "API access"].map((f, i) => (<FeatureItem key={i} text={f} />))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}