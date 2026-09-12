import Groq from "groq-sdk";
import { cleanResponse } from "./cleanResponse";

/**
 * Sends a query to the Groq API using fast models
 * @param {string} prompt - The student's question or the system instruction
 * @returns {Promise<string>} - The AI's response
 */
export async function queryGroq(prompt) {
    // 1. Validate API Key
    const apiKey = process.env.GROQ_API_KEY;
    const placeholders = ["gsk_your_key_here", "your_groq_api_key_here"];
    if (!apiKey || placeholders.includes(apiKey.trim())) {
        const keyErr = "[Groq Error] GROQ_API_KEY is missing or invalid in environment variables (.env.local)";
        console.error(keyErr);
        throw new Error("GROQ_API_KEY is missing or not properly configured in .env.local");
    }

    const groq = new Groq({
        apiKey: apiKey,
    });

    const modelName = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";

    try {
        console.log(`[Groq] Requesting completion using model: ${modelName}...`);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: modelName,
            temperature: 0.7,
            max_tokens: process.env.GROQ_MAX_TOKENS ? parseInt(process.env.GROQ_MAX_TOKENS) : 1000,
            top_p: 1,
            stream: false,
        });

        const responseContent = chatCompletion.choices[0]?.message?.content;
        if (!responseContent) {
            throw new Error("Groq API completed successfully but returned no text content.");
        }

        return cleanResponse(responseContent);

    } catch (error) {
        console.error("[Groq Technical Error Stack]:", error);
        throw error;
    }
}

