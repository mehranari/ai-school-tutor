import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Sends a query to the Groq API using Llama 3 or similar fast models
 * @param {string} prompt - The student's question or the system instruction
 * @returns {Promise<string>} - The AI's response or a friendly error message
 */
export async function queryGroq(prompt) {
    // 1. Validate API Key
    if (!process.env.GROQ_API_KEY) {
        console.error("DEBUG: GROQ_API_KEY is missing in .env.local");
        return "I'm sorry, I'm having trouble connecting to my brain! (Groq API Key missing)";
    }

    try {
        console.log(`[Groq] Requesting completion...`);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile", // Using a powerful and fast Llama 3 model
            temperature: 0.7,
            max_tokens: 4096,
            top_p: 1,
            stream: false,
        });

        return chatCompletion.choices[0]?.message?.content || "I understood your question, but I couldn't quite form an answer.";

    } catch (error) {
        console.error("[Groq Technical Debug Log]:", error);

        if (error?.status === 429) {
            return "Wow, lots of students are asking questions right now! Please wait a moment and try again.";
        }

        return "Oops! I had a little trouble thinking just now. Let's try that question again!";
    }
}
