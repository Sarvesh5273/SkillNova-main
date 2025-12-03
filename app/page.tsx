import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer" // <--- Changed this import
import { FaqSection } from "@/components/faq-section"
import { AboutSection } from "@/components/about-section"
import Script from "next/script"
import { headers } from "next/headers"
import Plasma from "@/components/plasma"

type Currency = "INR" | "USD"

// Function to determine currency on the server
function getCurrency(): Currency {
  const headersList = headers()
  const countryHeader =
    headersList.get("x-country-code") ||
    headersList.get("cf-ipcountry") || 
    ""

  const country = countryHeader.toUpperCase()
  const isSouthAsia = ["IN", "PK", "BD"].includes(country)
  return isSouthAsia ? "INR" : "USD"
}

export default function Page() {
  const currency = getCurrency() 

  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://skillnova.com/#pricing",
    name: "SkillNova Pricing Plans",
    description: "AI Career Mentorship pricing plans - Free, Pro, and Enterprise packages for career development",
    url: "https://skillnova.com/#pricing",
    mainEntity: {
      "@type": "PriceSpecification",
      name: "SkillNova AI Career Mentorship",
      description: "Professional AI career mentorship services with three pricing tiers",
      offers: [
        {
          "@type": "Offer",
          name: "Free Plan",
          price: "0",
          priceCurrency: "USD",
          description: "Basic career guidance with limited mentorship sessions",
        },
        {
          "@type": "Offer",
          name: "Pro Plan",
          price: "29",
          priceCurrency: "USD",
          description: "Unlimited mentorship, premium roadmaps, and advanced goal tracking",
        },
        {
          "@type": "Offer",
          name: "Enterprise Plan",
          price: "99",
          priceCurrency: "USD",
          description: "Custom AI models, team management, and priority support",
        },
      ],
    },
  }

  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://skillnova.com/",
    name: "SkillNova | Your AI Career Mentor",
    description:
      "Get personalized roadmaps, daily goals, and mentorship to master your career journey with SkillNova's AI-powered career guidance.",
    url: "https://skillnova.com/",
    mainEntity: {
      "@type": "Organization",
      name: "SkillNova",
      url: "https://skillnova.com",
      sameAs: [
        "https://twitter.com/skillnova",
        "https://www.youtube.com/@skillnova",
        "https://instagram.com/skillnova",
        "https://threads.com/skillnova",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://skillnova.com/#pricing",
        name: "Pricing Section",
        url: "https://skillnova.com/#pricing",
      },
      {
        "@type": "WebPageElement",
        "@id": "https://skillnova.com/#about",
        name: "About Section",
        url: "https://skillnova.com/#about",
      },
    ],
  }

  return (
    <>
    <div className="fixed inset-0 z-0 bg-black">
         <Plasma color="#8b5cf6" speed={0.8} direction="forward" scale={1.5} opacity={0.4} mouseInteractive={true} />
      </div>
      
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <Features />
        <Pricing currency={currency} />
        <FaqSection />
        <AboutSection />
        <Footer /> {/* <--- Updated Component */}
      </main>

      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}