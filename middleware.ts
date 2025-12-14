import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

// --- ADDED: Custom Headers for Dev Tunnel FIX ---
const DEVTUNNEL_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
// --------------------------------------------------

export async function middleware(request: NextRequest) {
  // CLONE the request to modify its headers, required for Next.js security checks
  const newRequest = request.clone();
  
  // FIX: If using a dev tunnel, we must explicitly set the Host and Origin headers 
  // to prevent the "Invalid Server Action Request" error.
  if (DEVTUNNEL_URL.includes(".devtunnels.ms") || DEVTUNNEL_URL.includes("ngrok.io")) {
      const url = new URL(DEVTUNNEL_URL);
      
      // Ensure the Host header matches the public URL
      newRequest.headers.set("Host", url.host);
      newRequest.headers.set("Origin", url.origin);
      newRequest.headers.set("X-Forwarded-Host", url.host);
  }

  // Use the modified request for session updating
  return await updateSession(newRequest);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}