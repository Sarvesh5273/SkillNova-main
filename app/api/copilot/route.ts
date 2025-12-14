import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openRouterClient, MODELS } from "@/lib/ai-client";

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // 1. Fetch Transcript
    const supabase = await createClient();
    const { data: nodeData } = await supabase
      .from('nodes')
      .select('transcript')
      .ilike('title', context)
      .single();

    const transcript = nodeData?.transcript || "No transcript available.";

    // 2. ROUTER LOGIC (With Safety Net)
    let targetModel = MODELS.GENERAL; // Default safe model
    let modelType = "GENERAL";

    try {
        const routerResponse = await openRouterClient.chat.completions.create({
            model: MODELS.ROUTER,
            messages: [
                {
                    role: "system",
                    content: `Classify the user's question. 
                    If it asks for code generation/syntax, return {"type": "CODE"}. 
                    Otherwise return {"type": "GENERAL"}. 
                    Output valid JSON only.`
                },
                { role: "user", content: message }
            ],
            // 'json_object' mode is safer but not supported by all free models, 
            // so we parse manually below to be safe.
        });

        const content = routerResponse.choices[0].message.content || "";
        if (content.includes("CODE")) {
            targetModel = MODELS.CODE;
            modelType = "CODE";
        }
    } catch (routerError) {
        console.warn("Router failed, defaulting to GENERAL:", routerError);
        // We continue with GENERAL model instead of crashing
    }

    // 3. GENERATE ANSWER
    const answerResponse = await openRouterClient.chat.completions.create({
      model: targetModel,
      messages: [
        {
          role: "system",
          content: `You are SkillNova, an AI Career Mentor.
          CONTEXT: User is watching "${context}".
          TRANSCRIPT: "${transcript}"
          
          INSTRUCTIONS:
          - Answer based on the transcript.
          - If the transcript doesn't cover it, use general knowledge.
          - Be concise.`
        },
        { role: "user", content: message }
      ]
    });

    const replyText = answerResponse.choices[0].message.content || "I'm having trouble thinking right now. Please try again.";

    return NextResponse.json({ 
      reply: replyText, 
      modelUsed: modelType 
    });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ 
        reply: "I encountered a system error. Please check your API key or try again." 
    }, { status: 200 }); // Return 200 so the UI displays the message instead of crashing
  }
}