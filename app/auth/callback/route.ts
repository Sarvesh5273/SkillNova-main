import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Default to '/' (Landing Page) if no 'next' param is provided
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // FIX: Added 'await' because your createClient() returns a Promise
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Clean success redirect
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Error handling
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}