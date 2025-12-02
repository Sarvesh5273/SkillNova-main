"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { LoginDialog } from "@/components/login-dialog"
import { motion, Variants } from "framer-motion"

export function FaqSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <motion.section
      id="faq"
      className="text-white py-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }} // Trigger when 10% is visible
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-xl">
            <motion.div
              className="relative space-y-12"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              <motion.header className="space-y-4" variants={itemVariants}>
                <h1 className="text-4xl font-bold tracking-tight text-lime-300">Frequently Asked Questions</h1>
                <p className="text-neutral-400 text-lg">
                  Everything you need to know about SkillNova's AI-powered career guidance platform.
                </p>
              </motion.header>

              <motion.div
                className="text-center bg-white/5 rounded-xl p-6 border border-white/10"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
                <p className="text-neutral-400 mb-4">
                  Get in touch with our support team for personalized assistance.
                </p>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <a
                    href="https://wa.me/1234567890?text=Hi%2C%20I%20have%20a%20question%20about%20SkillNova"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Us on WhatsApp
                  </a>
                </Button>
              </motion.div>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">1. How does SkillNova's AI career guidance work?</h2>
                <p className="text-neutral-300">Our AI analyzes your professional background, skills, and career goals to provide personalized recommendations. It uses natural language processing to understand your needs and machine learning to suggest optimal career paths.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">2. Can the AI help me optimize my resume?</h2>
                <p className="text-neutral-300">Our AI reviews your resume content, structure, and keywords to suggest improvements that increase your chances of passing ATS systems and catching recruiters' attention.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">3. Is my personal and career information secure?</h2>
                <p className="text-neutral-300">Yes, we use enterprise-grade encryption and follow strict data privacy protocols. Your information is never shared with third parties and you maintain full control over your data.</p>
              </motion.section>

              {/* Apply the same motion.section wrapper to all remaining Q&A sections */}
              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">4. How accurate are the job recommendations?</h2>
                <p className="text-neutral-300">Our AI uses advanced matching algorithms that consider your skills, experience, preferences, and market trends. The accuracy improves as you interact more with the platform and provide feedback.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">5. Can I practice interviews with the AI?</h2>
                <p className="text-neutral-300">Yes! Our AI interviewer conducts mock interviews tailored to your industry and specific job roles. You'll receive detailed feedback on your responses, body language, and areas for improvement.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">6. What industries does SkillNova support?</h2>
                <p className="text-neutral-300">We support professionals across all major industries including technology, healthcare, finance, marketing, education, and more. Our AI is trained on diverse career data to provide relevant guidance.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">7. How often should I use the platform?</h2>
                <p className="text-neutral-300">We recommend regular check-ins to track your progress and receive updated recommendations. Many users find weekly sessions helpful for staying on track with their career goals.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">8. Can SkillNova help with career transitions?</h2>
                <p className="text-neutral-300">Our AI specializes in identifying transferable skills and suggesting transition paths. It can recommend courses, certifications, and networking strategies for successful career pivots.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">9. Is there a mobile app available?</h2>
                <p className="text-neutral-300">Yes, SkillNova is available on both iOS and Android. You can access all features including chat guidance, resume optimization, and interview practice on your mobile device.</p>
              </motion.section>

              <motion.section className="space-y-3" variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-white">10. How do I get started?</h2>
                <p className="text-neutral-300">
                  Simply{" "}
                  <LoginDialog>
                    <button className="text-lime-300 underline bg-transparent border-none p-0 cursor-pointer">sign up</button>
                  </LoginDialog>{" "}
                  and complete your career profile. Our AI will immediately begin providing personalized recommendations based on your background and goals.
                </p>
              </motion.section>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}