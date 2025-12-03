"use client";

import { useState } from "react";
import { CodeEditor } from "./code-editor";
import { Terminal } from "./terminal";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Default starter code for JS
const STARTER_CODE = `// Challenge: Reverse a string
function solution(str) {
  // Write your code here
  return str;
}

// Test Case (Do not modify)
console.log(solution("SkillNova"));
`;

export function CodeChallenge() {
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      // Calling Piston API (Public Execution Engine)
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "javascript",
          version: "18.15.0",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      if (data.run && data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(data.run.stdout);
      }
    } catch (err) {
      setError("Failed to execute code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/10">
      
      {/* Editor Area */}
      <div className="flex-1 min-h-0 relative">
        <CodeEditor 
            language="javascript" 
            code={code} 
            onChange={(val) => setCode(val || "")} 
        />
        
        {/* Run Button (Floating) */}
        <div className="absolute bottom-4 right-4 z-10">
            <Button 
                onClick={runCode} 
                disabled={isRunning}
                className="bg-lime-500 hover:bg-lime-400 text-black font-bold shadow-lg hover:shadow-lime-500/20"
            >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Run Code
            </Button>
        </div>
      </div>

      {/* Terminal Area */}
      <Terminal output={output} error={error} isLoading={isRunning} />
    </div>
  );
}