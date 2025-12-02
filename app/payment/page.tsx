"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, CreditCard, Lock } from "lucide-react"

function PaymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "Selected Plan"
  const price = searchParams.get("price") || "$0"

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process the payment here.
    // For this mock page, we'll just redirect to the chat.
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-border bg-black/50 border-white/10 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
          <CardDescription className="text-gray-400">
            You're subscribing to the <span className="font-semibold text-lime-300">{plan}</span> plan.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
              <span className="font-medium">Amount Due</span>
              <span className="text-2xl font-bold text-lime-300">{price}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Information</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="Card Number"
                  className="bg-white/5 border-white/10 pl-10"
                  required
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM / YY" className="bg-white/5 border-white/10" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="CVC" className="bg-white/5 border-white/10" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold">
              Pay Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Secure SSL Encrypted Payment</span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

// Use Suspense to handle client-side rendering of search params
export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentForm />
    </Suspense>
  )
}
