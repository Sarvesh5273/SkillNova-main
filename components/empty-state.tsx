// components/empty-state.tsx
import { Card } from "@/components/ui/card";
import { Lightbulb, Code, BookOpen } from "lucide-react";

const examplePrompts = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    text: "Help me create a career roadmap for a full-stack developer.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    text: "Review my resume for a data scientist role.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    text: "Suggest some projects to improve my React skills.",
  },
];

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">SkillNova AI</h1>
      <p className="text-neutral-400 text-lg mb-12">Your personal career mentor. How can I help you today?</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {examplePrompts.map((prompt, i) => (
          <Card
            key={i}
            className="p-4 bg-transparent border-neutral-800 hover:bg-neutral-800/50 cursor-pointer transition-colors text-left"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-lime-400 mb-8">{prompt.icon}</div>
              <p className="text-white text-base">{prompt.text}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}