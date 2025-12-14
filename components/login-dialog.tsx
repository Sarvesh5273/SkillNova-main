"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react" 

interface LoginDialogProps {
  children: React.ReactNode
  plan?: { name: string; price: string }
}

export function LoginDialog({ children, plan }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"

  const handleVerificationSuccess = (token: string) => {
    setCaptchaToken(token)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!captchaToken) {
      setError("Please complete the CAPTCHA challenge.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      })
      if (error) throw error

      if (plan && plan.name !== "Free") {
        router.push(`/payment?plan=${plan.name}&price=${encodeURIComponent(plan.price)}`)
      } else {
        router.push("/onboarding")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!captchaToken) {
      setError("Please complete the CAPTCHA challenge.")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      let redirectTo = `${window.location.origin}/auth/callback`
      if (plan && plan.name !== "Free") {
        redirectTo += `?next=/payment?plan=${plan.name.toLowerCase()}&price=${encodeURIComponent(plan.price)}`
      } else {
        redirectTo += `?next=/onboarding` 
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: redirectTo,
          data: {
            full_name: name,
          },
        },
      })
      if (error) throw error

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black border-neutral-800 p-8">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-white">
            Welcome to SkillNova
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {plan ? `Signing up for the ${plan.name} plan` : "Your AI career mentor awaits"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger
              value="login"
              className="text-white data-[state=active]:bg-lime-500/20 data-[state=active]:text-lime-400"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="text-white data-[state=active]:bg-lime-500/20 data-[state=active]:text-lime-400"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-white">Email</Label>
                <Input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login" className="text-white">Password</Label>
                <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/5 border-white/10 text-white" />
              </div>

              {/* FIX: Reserve space to prevent layout jump */}
              <div className="min-h-[78px] flex justify-center">
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={handleVerificationSuccess}
                  theme="dark"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                <Input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-white/5 border-white/10 text-white" />
              </div>

               {/* FIX: Reserve space to prevent layout jump */}
              <div className="min-h-[78px] flex justify-center">
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={handleVerificationSuccess}
                  theme="dark"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}