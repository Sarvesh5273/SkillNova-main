"use client";

import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ language, code, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
        <span className="text-xs font-mono text-gray-400 uppercase">{language} Environment</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
      </div>

      {/* The Monaco Editor */}
      <div className="h-[400px] w-full relative"> {/* Fixed height for now */}
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          theme="vs-dark"
          onChange={onChange}
          loading={<div className="flex items-center justify-center h-full text-lime-500"><Loader2 className="animate-spin w-8 h-8" /></div>}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "JetBrains Mono, monospace",
          }}
        />
      </div>
    </div>
  );
}