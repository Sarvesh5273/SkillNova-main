import { NextResponse } from "next/server"

const SOUTH_ASIA = new Set(["IN", "PK", "BD"])

export async function GET(request: Request) {
  // Removed the Vercel-specific header check
  const countryHeader =
    request.headers.get("x-country-code") ||
    request.headers.get("cf-ipcountry") || // Cloudflare header
    ""

  let country = countryHeader.toUpperCase()

  // If no server-provided country, use very light heuristics from headers
  if (!country) {
    const acceptLang = request.headers.get("accept-language") || ""
    if (/-(IN|PK|BD)\b/i.test(acceptLang)) {
      country = acceptLang.match(/-(IN|PK|BD)\b/i)?.[1]?.toUpperCase() || ""
    }
  }

  const isSouthAsia = SOUTH_ASIA.has(country)
  const currency = isSouthAsia ? "INR" : "USD"

  return NextResponse.json({
    country: country || null,
    region: isSouthAsia ? "SOUTH_ASIA" : "OTHER",
    currency, // "INR" or "USD"
  })
}
