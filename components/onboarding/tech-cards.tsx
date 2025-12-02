"use client"

import { motion } from "framer-motion";
import { Code2, Server, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechCardsProps {
  onSelect: (path: string) => void;
}

const cards = [
  {
    id: "frontend",
    title: "The Creator",
    subtitle: "Frontend Architecture",
    icon: Code2,
    desc: "For visual thinkers. High creativity.",
    tags: ["#React", "#Design", "#UX"],
    color: "text-blue-400",
    border: "group-hover:border-blue-500/50",
    bg: "group-hover:bg-blue-500/10",
  },
  {
    id: "backend",
    title: "The Architect",
    subtitle: "Backend & Cloud",
    icon: Server,
    desc: "For logical problem solvers. High stability.",
    tags: ["#NodeJS", "#DB", "#Scale"],
    color: "text-amber-400",
    border: "group-hover:border-amber-500/50",
    bg: "group-hover:bg-amber-500/10",
  },
  {
    id: "ai",
    title: "The Innovator",
    subtitle: "AI & Machine Learning",
    icon: BrainCircuit,
    desc: "For math & data lovers. Explosive growth.",
    tags: ["#Python", "#TensorFlow", "#Data"],
    color: "text-purple-400",
    border: "group-hover:border-purple-500/50",
    bg: "group-hover:bg-purple-500/10",
  },
];

export function TechCards({ onSelect }: TechCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(card.title)}
          className={cn(
            "group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md cursor-pointer transition-all duration-500",
            card.border,
            "hover:scale-105 hover:-translate-y-2"
          )}
        >
          {/* Glowing Background Effect */}
          <div className={cn("absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500", card.bg)} />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={cn("p-4 rounded-full bg-white/5 mb-4", card.color)}>
              <card.icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
            <p className={cn("text-sm font-medium mb-4 uppercase tracking-wider", card.color)}>
              {card.subtitle}
            </p>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {card.desc}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {card.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}