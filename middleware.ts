import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";

// --- ADDED: Custom Headers for Dev Tunnel FIX ---
const DEVTUNNEL_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
// --------------------------------------------------

export async function middleware(request: NextRequest) {
  // 1. Create a mutable copy of the headers
  const requestHeaders = new Headers(request.headers);

  // 2. FIX: If using a dev tunnel, explicitly set Host/Origin
  if (DEVTUNNEL_URL.includes(".devtunnels.ms") || DEVTUNNEL_URL.includes("ngrok.io")) {
      const url = new URL(DEVTUNNEL_URL);
      
      requestHeaders.set("Host", url.host);
      requestHeaders.set("Origin", url.origin);
      requestHeaders.set("X-Forwarded-Host", url.host);
  }

  // 3. Create a NEW NextRequest using the modified headers
  // This ensures 'newRequest' is strictly typed as 'NextRequest'
  const newRequest = new NextRequest(request, {
      headers: requestHeaders,
  });

  // 4. Pass the correctly typed request to Supabase
  return await updateSession(newRequest);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};