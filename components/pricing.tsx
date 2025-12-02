"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { motion, Variants } from "framer-motion"
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
    
    if (loading) {
      return <Button disabled className={`${commonBtnClass} bg-neutral-400`}>Loading...</Button>
    }

    if (user) {
      return (
        <Button 
          className={commonBtnClass} style={{ backgroundColor: ACCENT }}
          onClick={() => handleUpgradeClick(plan)}
        >
          Upgrade
        </Button>
      )
    }

    return (
      <LoginDialog plan={plan}>
        <Button className={commonBtnClass} style={{ backgroundColor: ACCENT }}>
          Get Started
        </Button>
      </LoginDialog>
    )
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.section
      id="pricing"
      className="text-white"
      itemScope
      itemType="https://schema.org/PriceSpecification"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <motion.div className="mx-auto max-w-3xl text-center" variants={itemVariants}>
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "rgba(198,255,58,0.12)", color: ACCENT }}
          >
            Career Mentorship Plans
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            Simple, Transparent Pricing.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400" itemProp="description">
            Choose the perfect plan for your career development journey. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <motion.div className="mt-10 grid gap-6 lg:grid-cols-3" variants={containerVariants}>
          {/* Free Plan */}
          <motion.div variants={itemVariants}>
            <Card
              className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 h-full"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <CardHeader className="space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200" itemProp="name">Free</div>
                <div className="flex items-end gap-2 text-neutral-100">
                  <div className="text-xl font-bold tracking-tight" itemProp="price">{PRICES[currency].free}</div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">forever</span>
                  <meta itemProp="priceCurrency" content={currency} />
                </div>
                <div className="flex gap-2">
                  {planButton({ name: "Free", price: PRICES[currency].free })}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid gap-2" itemProp="description">
                  {[
                    "5 mentorship sessions per month", "Basic career guidance", "Community support",
                    "Standard response time", "Basic goal tracking", "Email notifications",
                  ].map((f, i) => (<FeatureItem key={i} text={f} />))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div variants={itemVariants}>
            <Card
              className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 h-full"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <div className="absolute right-4 top-11 rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: "#1f1f1f", color: "#d4d4d4" }}>{PRICES[currency].save}</div>
              <CardHeader className="space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200" itemProp="name">Pro</div>
                <div className="flex items-end gap-2 text-neutral-100">
                  <div className="text-xl font-bold tracking-tight" itemProp="price">{PRICES[currency].pro}</div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">per month</span>
                  <meta itemProp="priceCurrency" content={currency} />
                </div>
                <div className="flex gap-2">
                  {planButton({ name: "Pro", price: PRICES[currency].pro })}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid gap-2" itemProp="description">
                  {[
                    "Unlimited mentorship sessions", "Premium roadmaps & resources", "Priority support",
                    "Advanced goal tracking", "Detailed progress analytics", "Interview preparation tools",
                  ].map((f, i) => (<FeatureItem key={i} text={f} />))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div variants={itemVariants}>
            <Card
              className="relative overflow-hidden rounded-2xl liquid-glass-enhanced shadow-[0_16px_50px_rgba(0,0,0,0.4)] transition-all duration-300 h-full"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <CardHeader className="relative space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200" itemProp="name">Enterprise</div>
                <div className="flex items-end gap-2 text-white">
                  <div className="text-xl font-bold tracking-tight" itemProp="price">{PRICES[currency].enterprise}</div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">per month</span>
                  <meta itemProp="priceCurrency" content={currency} />
                </div>
                <div className="flex gap-2">
                   {planButton({ name: "Enterprise", price: PRICES[currency].enterprise })}
                </div>
              </CardHeader>
              <CardContent className="relative pt-0">
                <ul className="grid gap-2" itemProp="description">
                  {[
                    "Custom AI models for your team", "24/7 dedicated career consultants", "Advanced team analytics",
                    "Custom integrations & API access", "White-label solution available", "Compliance & security features",
                  ].map((f, i) => (<FeatureItem key={i} text={f} />))}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}