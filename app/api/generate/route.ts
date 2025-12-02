import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION = `You are SkillNova, an expert AI Career Mentor. 
Your goal is to provide specific, actionable, and encouraging advice regarding career development, resume building, interview preparation, and skill acquisition.
- Be professional yet accessible.
- If asked about resumes, focus on ATS optimization and action verbs.
- If asked about interviews, provide STAR method examples.
- Do not provide medical, legal, or financial advice.`;

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required in the request body" },
        { status: 400 }
      );
    }

    // UPDATED MODEL NAME HERE vvv
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 1000 },
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const result = await chat.sendMessageStream(lastMessage.content);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (streamError) {
          console.error("Stream processing error:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.message?.includes("API key")) {
        return NextResponse.json({ error: "Invalid API Configuration" }, { status: 401 });
    } else if (error.status === 429) {
        return NextResponse.json({ error: "High traffic, please try again later." }, { status: 429 });
    } else if (error.status === 404) {
        // Handle model not found explicitly
        return NextResponse.json({ error: "Model unavailable. Please contact admin to update AI model." }, { status: 503 });
    }
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}