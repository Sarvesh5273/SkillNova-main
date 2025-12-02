import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glass-border bg-black/50 border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Thank you for signing up!</CardTitle>
            <CardDescription className="text-gray-400">Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 text-center">
              You&apos;ve successfully signed up for SkillNova. Please check your email to confirm your account before
              signing in.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
