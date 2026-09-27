import { queryGroq } from "../../../lib/groq";
import { generatePrompt } from "../../../lib/promptTemplates";
import { cleanResponse } from "../../../lib/cleanResponse";

/**
 * API Route: /api/tutor
 * Main tutor endpoint used by ChatBox.js
 */
export async function POST(req) {
    try {
        const { message, grade, subject, mode } = await req.json();

        if (!message || !grade || !subject) {
            return new Response(JSON.stringify({ error: "Missing required fields: message, grade, or subject." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const prompt = generatePrompt({
            grade: parseInt(grade) || 5,
            subject: subject || "General",
            curriculum: "general",
            mode: mode === "exam" ? "exam_paper" : "explain",
            studentQuestion: message,
        });

        const aiResponse = await queryGroq(prompt);

        let cleanedResponse = cleanResponse(aiResponse);

        // Remove the prompt itself if the model echoed it back
        if (cleanedResponse.startsWith(prompt.slice(0, 50))) {
            cleanedResponse = cleanedResponse.replace(prompt, "").trim();
        }

        return new Response(JSON.stringify({ response: cleanedResponse }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("[/api/tutor Error]:", {
            status: error?.status || 500,
            message: error?.message,
            stack: error?.stack,
        }, error);

        const isApiKeyError = error?.message?.includes("GROQ_API_KEY");
        if (isApiKeyError) {
            return new Response(JSON.stringify({
                error: "Configuration Error",
                message: "GROQ_API_KEY is not defined or invalid.",
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({
            error: "Service busy",
            message: "High demand, please try again.",
        }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }
}

