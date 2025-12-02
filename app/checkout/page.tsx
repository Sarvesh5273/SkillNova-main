"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight } from "lucide-react"

interface OrderState {
  package: {
    name: string
    price: string
    priceValue: number
  } | null
}

const PRICE_VALUES = {
  starter: { inr: 999, usd: 12 },
  professional: { inr: 2999, usd: 36 },
  enterprise: { inr: 9999, usd: 120 },
}

const PRICES = {
  starter: { inr: "₹999/-", usd: "$12" },
  professional: { inr: "₹2,999/-", usd: "$36" },
  enterprise: { inr: "₹9,999/-", usd: "$120" },
}

type Currency = "INR" | "USD"

function guessLocalCurrency(): Currency {
  const lang = typeof navigator !== "undefined" ? navigator.language : ""
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""
  if (/-(IN|PK|BD)\b/i.test(lang) || /(Kolkata|Karachi|Dhaka)/i.test(tz || "")) return "INR"
  return "USD"
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [order, setOrder] = useState<OrderState>({
    package: null,
  })

  // Load currency from geo API
  useEffect(() => {
    let cancelled = false
    async function loadCurrency() {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" })
        if (!res.ok) throw new Error("geo failed")
        const data = await res.json()
        if (!cancelled) setCurrency(data?.currency === "INR" ? "INR" : "USD")
      } catch {
        if (!cancelled) setCurrency(guessLocalCurrency())
      }
    }
    loadCurrency()
    return () => {
      cancelled = true
    }
  }, [])

  // Initialize order from URL params only once
  useEffect(() => {
    if (isInitialized || currency === null) return

    const plan = searchParams.get("plan")
    if (plan && ["starter", "professional", "enterprise"].includes(plan.toLowerCase())) {
      const planKey = plan.toLowerCase() as keyof typeof PRICES
      const planName = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()

      const packageData = {
        name: planName,
        price: currency === "INR" ? PRICES[planKey].inr : PRICES[planKey].usd,
        priceValue: currency === "INR" ? PRICE_VALUES[planKey].inr : PRICE_VALUES[planKey].usd,
      }

      setOrder({
        package: packageData,
      })

      setIsInitialized(true)
    } else {
      router.push("/")
    }
  }, [searchParams, router, isInitialized, currency])

  const formatPrice = (price: number) => {
    if (currency === "INR") {
      return `₹${price.toLocaleString()}`
    } else {
      return `$${price.toLocaleString()}`
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const handleConfirmOrder = () => {
    // Redirect to contact section instead of WhatsApp
    router.push("/#contact")
  }

  // Show loading state until initialized
  if (!isInitialized || !order.package) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C6FF3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 liquid-glass-header border-b border-neutral-900">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 hover:bg-neutral-800 rounded-full -ml-2 sm:p-2.5"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="flex items-center justify-between flex-1 mx-3 sm:mx-4">
              <div className="text-base font-semibold text-white sm:text-lg">{order.package.name} Plan</div>
              <div className="text-base font-bold text-[#C6FF3A] sm:text-lg">
                {formatPrice(order.package.priceValue)}
              </div>
            </div>
            <div className="w-8 sm:w-10" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 pb-32 sm:px-6 sm:py-12 sm:pb-40">
        <div className="max-w-sm mx-auto sm:max-w-md">
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Order Summary</h2>
              <p className="text-neutral-400 text-base leading-relaxed sm:text-lg">
                Review your AI chatbot plan selection
              </p>
            </div>

            <Card className="border-neutral-800 liquid-glass rounded-xl sm:rounded-2xl">
              <CardContent className="p-5 space-y-4 sm:p-8 sm:space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-neutral-800 sm:py-4">
                  <div>
                    <h4 className="font-semibold text-white text-base sm:text-lg">{order.package.name} Plan</h4>
                    <p className="text-neutral-400 text-sm mt-0.5 sm:mt-1">AI Chatbot Subscription</p>
                  </div>
                  <span className="font-bold text-white text-base sm:text-lg">{order.package.price}</span>
                </div>

                <div className="flex justify-between items-center py-4 bg-[#C6FF3A]/10 rounded-xl px-4 mt-4 sm:py-6 sm:rounded-2xl sm:px-6 sm:mt-6">
                  <h4 className="text-lg font-bold text-white sm:text-xl">Monthly Total</h4>
                  <span className="text-2xl font-bold text-[#C6FF3A] sm:text-3xl">
                    {formatPrice(order.package.priceValue)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 liquid-glass-header border-t border-neutral-800 p-4 sm:p-8">
        <div className="max-w-sm mx-auto sm:max-w-md">
          <Button
            onClick={handleConfirmOrder}
            className="w-full h-12 text-base font-semibold bg-[#C6FF3A] text-black hover:bg-[#C6FF3A]/90 rounded-xl shadow-lg shadow-[#C6FF3A]/20 sm:h-16 sm:text-xl sm:rounded-2xl"
          >
            Continue to Contact
            <ArrowRight className="h-4 w-4 ml-2 sm:h-6 sm:w-6 sm:ml-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
