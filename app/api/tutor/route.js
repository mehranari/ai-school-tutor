import { queryGroq } from "../../../lib/groq";
import { generatePrompt } from "../../../lib/promptTemplates";

/**
 * API Route for the AI Tutor.
 * Handles both chat messages and exam generation requests.
 */
export async function POST(req) {
    try {
        const { message, grade, subject, mode } = await req.json();

        // Use the advanced prompt generator
        const prompt = generatePrompt({
            grade: parseInt(grade) || 5,
            subject: subject || 'General',
            curriculum: 'general',
            mode: mode === 'exam' ? 'exam_paper' : 'explain',
            studentQuestion: message,
        });

        const aiResponse = await queryGroq(prompt);


        return new Response(JSON.stringify({ response: aiResponse }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
