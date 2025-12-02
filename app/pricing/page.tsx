import { Pricing } from "@/components/pricing";
import { AppverseFooter } from "@/components/appverse-footer";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | SkillNova",
  description: "Choose the perfect AI career mentorship plan for your journey. Free, Pro, and Enterprise options available.",
};

type Currency = "INR" | "USD";

export default function PricingPage() {
  const headersList = headers();
  const countryHeader =
    headersList.get("x-country-code") ||
    headersList.get("cf-ipcountry") ||
    "";
  const country = countryHeader.toUpperCase();
  const isSouthAsia = ["IN", "PK", "BD"].includes(country);
  const currency: Currency = isSouthAsia ? "INR" : "USD";

  return (
    <>
      <main className="min-h-screen text-white flex flex-col">
        {/* SiteHeader has been removed */}
        <div className="flex-grow">
          <Pricing currency={currency} />
        </div>
        <AppverseFooter />
      </main>
    </>
  );
}