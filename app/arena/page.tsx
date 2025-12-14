import { createClient } from "@/lib/supabase/server";
import { BossMonitor } from "@/components/arena/boss-monitor";
import { CodeChallenge } from "@/components/arena/code-challenge";

// Fetch Challenge Server-Side
async function getChallenge() {
  const supabase = await createClient();
  // Fetch a random challenge or a specific one
  const { data } = await supabase.from('challenges').select('*').limit(1).single();
  return data;
}

export default async function ArenaPage() {
  const challengeData = await getChallenge();

  // Fallback if DB is empty
  const challenge = challengeData || {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as a string s.",
    topic: "String Manipulation",
    starter_code: `function solution(str) {\n  // Write your code here\n  return str;\n}`,
    test_case_input: '"SkillNova"',
    test_case_output: '"avoNllikS"'
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden font-sans">
      
      {/* 1. THE BOSS MONITOR */}
      <BossMonitor />

      {/* 2. THE CHALLENGE AREA */}
      <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-80px)]">
        
        {/* LEFT: PROBLEM STATEMENT */}
        <div className="w-full md:w-1/3 bg-[#111] border border-white/10 rounded-2xl p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold text-white mb-4">Challenge: {challenge.title}</h1>
            
            <div className="prose prose-invert prose-sm text-gray-300 space-y-4">
                <p>{challenge.description}</p>
                
                <div className="bg-black/50 p-4 rounded-lg border border-white/5 my-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Test Case</h4>
                    <p className="font-mono text-sm"><span className="text-purple-400">Input:</span> {challenge.test_case_input}</p>
                    <p className="font-mono text-sm"><span className="text-lime-400">Output:</span> {challenge.test_case_output}</p>
                </div>
            </div>
        </div>

        {/* RIGHT: CODE EDITOR (With Logic) */}
        <div className="w-full md:w-2/3 h-full">
            <CodeChallenge 
                challenge={{
                    topic: challenge.topic,
                    starterCode: challenge.starter_code,
                    testCaseInput: challenge.test_case_input,
                    testCaseOutput: challenge.test_case_output
                }}
            />
        </div>

      </div>
    </div>
  );
}