import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glass-border bg-black/50 border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Authentication Error</CardTitle>
            <CardDescription className="text-gray-400">Something went wrong</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 text-center">
              There was an error confirming your email. Please try signing in again or contact support if the problem persists.
            </p>
            <div className="mt-6 text-center">
              <Link href="/" className="text-lime-300 hover:underline">
                Return to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
