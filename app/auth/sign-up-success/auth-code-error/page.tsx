"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorDesc = searchParams.get("error_description");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-red-900/50 rounded-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Authentication Failed</h1>
          <p className="text-neutral-400">
            {errorDesc ? decodeURIComponent(errorDesc) : "We encountered an issue logging you in."}
          </p>
        </div>

        <Link href="/">
          <Button className="w-full bg-white text-black hover:bg-neutral-200 font-bold">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}