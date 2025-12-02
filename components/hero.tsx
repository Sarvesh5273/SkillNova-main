"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { LoginDialog } from "./login-dialog" // Import the dialog component
import PhoneVideo from "./phone-video" // Import the PhoneVideo component

export function Hero() {
  const buttonNew = (
    <LoginDialog>
      <Button className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300 cursor-pointer">
        Get Started
      </Button>
    </LoginDialog>
  )

  return (
    <motion.section
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="relative isolate overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center gap-y-6">
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
            className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            <span className="block">SkillNova — Your </span>
            <span className="block">
              <span className="text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">AI</span>
              {" Career Mentor"}
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
            className="max-w-2xl mx-auto text-base leading-relaxed text-white/70 text-pretty"
          >
            Get personalized roadmaps, daily goals, and mentorship to master your career journey.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
          >
            {buttonNew}
          </motion.div>

          {/* Phone grid mimic */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
            className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
          >
            {phoneData.map((p, i) => {
              const visibility = i <= 2 ? "block" : i === 3 ? "hidden md:block" : i === 4 ? "hidden xl:block" : "hidden"

              return (
                <div key={i} className={visibility}>
                  <PhoneCard title={p.title} sub={p.sub} tone={p.tone} gradient={p.gradient} videoSrc={p.videoSrc} />
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  tone = "calm",
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
  imageSrc,
  videoSrc,
}: {
  title?: string
  sub?: string
  tone?: string
  gradient?: string
  imageSrc?: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        {videoSrc ? (
          <PhoneVideo src={videoSrc} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Image
            src={imageSrc ?? "/ai-career-guidance-chatbot-interface.jpg"}
            alt={`${title} - ${sub}`}
            fill
            className="absolute inset-0 h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
          <div className="space-y-1 px-1">
            <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-lime-300">
              {tone === "calm" ? "skillnova ai" : tone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const phoneData = [
  {
    title: "Career Guidance",
    sub: "AI-powered career path recommendations.",
    tone: "General",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc: "/videos/general.mp4",
  },
  {
    title: "Resume Builder",
    sub: "Smart resume optimization and tips.",
    tone: "builder",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
    videoSrc: "/videos/builder.mp4",
  },
  {
    title: "Interview Prep",
    sub: "Practice with AI-powered mock interviews.",
    tone: "Chatbot UI",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc: "/videos/ui.mp4",
  },
  {
    title: "Skill Assessment",
    sub: "Identify strengths and growth areas.",
    tone: "assessment",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
    videoSrc: "/videos/skill.mp4",
  },
  {
    title: "Job Matching",
    sub: "Find opportunities that fit your profile.",
    tone: "matching",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
    videoSrc: "/videos/dashboard.mp4",
  },
]