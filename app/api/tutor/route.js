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
        console.error("[/api/tutor Error Trace]:", error);

        const isApiKeyError = error.message?.includes("GROQ_API_KEY");
        const status = isApiKeyError ? 500 : (error.status || 503);
        const userFacingMessage = isApiKeyError
            ? "GROQ_API_KEY is missing or not properly configured in .env.local"
            : "The tutor is currently experiencing high demand. Please wait a few seconds and ask again!";

        return new Response(JSON.stringify({
            error: userFacingMessage,
            code: isApiKeyError ? "CONFIG_ERROR" : "SERVICE_BUSY",
        }), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
