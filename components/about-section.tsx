"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion"
import { Users, Target, Eye, Building, Calendar, GraduationCap } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
}

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
          // Corrected line: Pass the rounded number directly to format()
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
    <motion.div variants={itemVariants} className="bg-neutral-900/50 p-4 rounded-lg text-center">
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
    <motion.section
      id="about"
      className="text-white py-20 sm:py-24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" variants={itemVariants}>
            About SkillNova
          </motion.h2>
          <motion.p className="mt-4 text-lg text-neutral-400" variants={itemVariants}>
            Pioneering the future of AI-powered career development for professionals worldwide.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants} className="liquid-glass p-6 rounded-xl">
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
            <motion.div variants={itemVariants} className="liquid-glass p-6 rounded-xl">
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
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 gap-4">
            <StatCard icon={Users} label="Team Size" value={5} suffix="+" />
            <StatCard icon={Calendar} label="Founded" value={"2025"} />
            <StatCard icon={Building} label="Company" value="SkillNova" />
            <StatCard icon={GraduationCap} label="Learners" value={500} suffix="+" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}