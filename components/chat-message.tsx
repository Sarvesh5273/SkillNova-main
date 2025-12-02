// components/chat-message.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

// Wrap the component in React.memo to prevent unnecessary re-renders
export const ChatMessage = React.memo(({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      // Use a simpler, more performant fade-in animation
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-start gap-4", isUser && "justify-end")}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 border border-lime-500/50">
          <AvatarFallback className="bg-lime-500 text-black text-sm font-bold">
            SN
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-xl overflow-x-auto rounded-lg px-4 py-3 border prose prose-sm prose-invert",
          isUser
            ? "bg-lime-500/20 border-lime-500/30 text-white"
            : "bg-[#1e1f20] border-neutral-800"
        )}
      >
        {isUser ? (
          <p className="text-white whitespace-pre-wrap">{content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-white mt-3 mb-1" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-semibold text-white mt-2 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-neutral-300 my-2" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-lime-500/70" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-neutral-300" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
});

// Add a display name for better debugging
ChatMessage.displayName = 'ChatMessage';