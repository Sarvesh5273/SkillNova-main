"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Users, Target, Eye, Building, Calendar, GraduationCap } from "lucide-react"

const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 100, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest))
        }
      }),
    [springValue]
  )

  return <span ref={ref} />
}

const StatCard = ({
  icon,
  label,
  value,
  suffix = "",
}: {
  icon: React.ElementType
  label: string
  value: number | string
  suffix?: string
}) => {
  const Icon = icon
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-neutral-900/50 p-4 rounded-lg text-center"
    >
      <Icon className="h-6 w-6 text-lime-400 mx-auto mb-2" />
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-2xl font-semibold text-white">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        {suffix}
      </p>
    </motion.div>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="text-white py-20 sm:py-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div 
            className="max-w-4xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            About SkillNova
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Pioneering the future of AI-powered career development for professionals worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Mission & Vision */}
          <div className="space-y-6">
            <motion.div 
                className="liquid-glass p-6 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-lime-400/20 p-2 rounded-full">
                  <Target className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Our Mission</h3>
                  <p className="text-neutral-300 mt-2">
                    To democratize career mentorship and make it accessible to everyone, everywhere through
                    personalized AI guidance.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
                className="liquid-glass p-6 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-lime-400/20 p-2 rounded-full">
                  <Eye className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Our Vision</h3>
                  <p className="text-neutral-300 mt-2">
                    To be the world's leading AI career mentor, known for our commitment to user success, innovation,
                    and quality.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Users} label="Team Size" value={5} suffix="+" />
            <StatCard icon={Calendar} label="Founded" value={"2025"} />
            <StatCard icon={Building} label="Company" value="SkillNova" />
            <StatCard icon={GraduationCap} label="Learners" value={500} suffix="+" />
          </div>
        </div>
      </div>
    </section>
  )
}