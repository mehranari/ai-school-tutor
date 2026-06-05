import { queryGroq } from "../../../lib/groq";
import { generatePrompt } from "../../../lib/promptTemplates";

/**
 * API Route: /api/tutor
 * Main tutor endpoint used by ChatBox.js
 */
export async function POST(req) {
    try {
        const { message, grade, subject, mode } = await req.json();

        if (!message || !grade || !subject) {
            return new Response(JSON.stringify({ error: "Missing required fields." }), {
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

        // ✅ CRITICAL FIX: Do NOT strip ```mermaid blocks.
        // The old route.ts was removing all code blocks which prevented
        // diagrams from ever rendering. We only clean up loose artifacts.
        let cleanedResponse = aiResponse;

        // Remove leftover [INST] tags from model artifacts
        cleanedResponse = cleanedResponse.replace(/\[\/?INST\]/g, "").trim();

        // Remove the prompt itself if the model echoed it back
        if (cleanedResponse.startsWith(prompt.slice(0, 50))) {
            cleanedResponse = cleanedResponse.replace(prompt, "").trim();
        }

        return new Response(JSON.stringify({ response: cleanedResponse }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("API route error:", error);
        return new Response(JSON.stringify({
            error: error.message,
            response: "Oops! Something went wrong. Please try again."
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}