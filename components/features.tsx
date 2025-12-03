"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "What Makes SkillNova Different?",
  subtitle: "Discover our unique approach to AI mentorship",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    const savedContent = localStorage.getItem("SkillNova-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) setContent(parsed.features)
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      
      {/* Simplified Animation: No Stagger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {content.title}
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="hidden md:block liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl h-full">
            <CardHeader>
              <p className="tracking-widest text-neutral-400 text-lg">Personalized Mentorship</p>
              <CardTitle className="mt-1 text-xl text-white">Make the experience truly intuitive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 mt-8">
                  <Image src="/images/intuitive-1.png" alt="Mentorship Interface" fill className="object-cover" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 mt-4">
                  <Image src="/images/intuitive-2.png" alt="Progress Tracking" fill className="object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl h-full">
            <CardHeader>
              <p className="tracking-widest text-neutral-400 text-lg">Proven Results</p>
              <CardTitle className="mt-1 text-xl text-white">
                “In just 6 months, SkillNova guided me through a clear roadmap in full stack development.”
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-end gap-4">
                <div className="text-5xl font-bold text-lime-300">4.9</div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-lime-300 text-lime-300" />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-40 w-full">
                    <Image src="/images/top-rated-2.png" fill alt="Success 1" className="rounded-xl border border-white/10 object-cover" />
                </div>
                <div className="relative h-40 w-full">
                    <Image src="/images/top-rated-1.png" fill alt="Success 2" className="rounded-xl border border-white/10 object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}