import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/chat";

  // Use the environment variable for the definitive origin.
  // This completely avoids the port issue with dev tunnels.
  const origin = process.env.NEXT_PUBLIC_SITE_URL;

  if (!origin) {
    // A fallback for safety, though the env var should always be set.
    return NextResponse.redirect(`/auth/sign-up-success/auth-code-error`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/sign-up-success/auth-code-error`);
}