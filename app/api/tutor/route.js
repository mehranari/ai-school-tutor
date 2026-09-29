import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { generatePrompt } from "../../../lib/promptTemplates";
import { cleanResponse } from "../../../lib/cleanResponse";

/**
 * API Route: /api/tutor
 * Temporary Debug Handler surfacing direct Groq API errors
 */
export async function POST(req) {
    try {
        const { message, grade, subject, mode } = await req.json();

        if (!message || !grade || !subject) {
            return NextResponse.json({ error: "Missing required fields: message, grade, or subject." }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                response: "DEBUG API ERROR: GROQ_API_KEY environment variable is not defined or invalid.",
                text: "DEBUG API ERROR: GROQ_API_KEY environment variable is not defined or invalid."
            }, { status: 200 });
        }

        const groq = new Groq({ apiKey });

        const prompt = generatePrompt({
            grade: parseInt(grade) || 5,
            subject: subject || "General",
            curriculum: "general",
            mode: mode === "exam" ? "exam_paper" : "explain",
            studentQuestion: message,
        });

        const modelName = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: modelName,
            temperature: 0.7,
            max_tokens: 300,
            stream: false,
        });

        const responseContent = chatCompletion.choices[0]?.message?.content || "";
        const cleaned = cleanResponse(responseContent);

        return NextResponse.json({
            response: cleaned || "Empty response returned from model.",
            text: cleaned || "Empty response returned from model."
        }, { status: 200 });

    } catch (error) {
        console.error("[DEBUG API ERROR]:", error);
        const errorDetails = error?.message || (typeof error === "object" ? JSON.stringify(error) : String(error));
        return NextResponse.json({
            response: `DEBUG API ERROR: ${errorDetails}`,
            text: `DEBUG API ERROR: ${errorDetails}`
        }, { status: 200 });
    }
}


