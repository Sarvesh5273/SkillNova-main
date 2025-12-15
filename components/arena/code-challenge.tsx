"use client";

import { useState } from "react";
import { CodeEditor } from "./code-editor";
import { Terminal } from "./terminal";
import { Button } from "@/components/ui/button";
import { Play, Send } from "lucide-react";
import { ArenaAnalysis } from "./arena-analysis"; // Import the new analysis

// Props to receive real data from parent
interface CodeChallengeProps {
  challenge: {
    topic: string;
    starterCode: string;
    testCaseInput: string;
    testCaseOutput: string;
  };
}

export function CodeChallenge({ challenge }: CodeChallengeProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. The "Test Runner" Logic
  const runCode = async (isSubmission = false) => {
    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      // FIX: Safer Test Case Injection
      // We explicitly treat inputs as JSON to handle strings/arrays/objects correctly
      const wrappedCode = `
        ${code}
        
        try {
          // Parse the test case input safely
          // Note: We assume testCaseInput is a valid JSON string from the DB (e.g. '"SkillNova"' or '[1,2,3]')
          const input = ${challenge.testCaseInput}; 
          const expected = ${challenge.testCaseOutput};
          
          const result = solution(input);
          
          // Basic equality check (for simple types)
          if (JSON.stringify(result) === JSON.stringify(expected)) {
            console.log("✅ TEST PASSED");
            console.log("Input:", JSON.stringify(input));
            console.log("Output:", JSON.stringify(result));
          } else {
            console.error("❌ TEST FAILED");
            console.error("Expected:", JSON.stringify(expected));
            console.error("Received:", JSON.stringify(result));
          }
        } catch (err) {
          console.error("Runtime Error:", err.message);
        }
      `;

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "javascript",
          version: "18.15.0",
          files: [{ content: wrappedCode }],
        }),
      });

      const data = await response.json();

      if (data.run) {
        if (data.run.stderr) {
            setError(data.run.stderr);
            if (isSubmission) {
                setIsSuccess(false);
                setShowAnalysis(true);
            }
        } else {
            setOutput(data.run.stdout);
            
            // Check if our "✅ TEST PASSED" log exists in the output
            if (isSubmission) {
                const passed = data.run.stdout.includes("✅ TEST PASSED");
                setIsSuccess(passed);
                setShowAnalysis(true);
            }
        }
      }
    } catch (err) {
      setError("Execution System Offline. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/10 relative">
      
      {/* Analysis Overlay */}
      {showAnalysis && (
        <ArenaAnalysis 
            success={isSuccess} 
            topic={challenge.topic} 
            executionTime="42" // Mock time for MVP
            onRetry={() => setShowAnalysis(false)} 
        />
      )}

      {/* Editor Area */}
      <div className="flex-1 min-h-0 relative">
        <CodeEditor 
            language="javascript" 
            code={code} 
            onChange={(val) => setCode(val || "")} 
        />
        
        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <Button 
                onClick={() => runCode(false)} 
                disabled={isRunning}
                variant="secondary"
                className="bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] border border-white/10"
            >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Run
            </Button>
            <Button 
                onClick={() => runCode(true)} 
                disabled={isRunning}
                className="bg-lime-500 hover:bg-lime-400 text-black font-bold shadow-lg shadow-lime-500/20"
            >
                <Send className="w-4 h-4 mr-2" />
                Submit
            </Button>
        </div>
      </div>

      {/* Terminal Area */}
      <Terminal output={output} error={error} isLoading={isRunning} />
    </div>
  );
}