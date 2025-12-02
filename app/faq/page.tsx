import { FaqSection } from "@/components/faq-section";
import { AppverseFooter } from "@/components/appverse-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & FAQ | SkillNova",
  description: "Find answers to frequently asked questions about SkillNova's AI-powered career guidance platform.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen text-white flex flex-col">
      <div className="flex-grow">
        <FaqSection />
      </div>
      <AppverseFooter />
    </main>
  );
}