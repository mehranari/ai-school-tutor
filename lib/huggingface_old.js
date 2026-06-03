/**
 * This library handles communication with the Hugging Face Inference API.
 * We use the 'mistralai/Mistral-7B-Instruct-v0.2' model which is free and good for teaching.
 */

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";

/**
 * Sends a prompt to Hugging Face and returns the generated text.
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<string>} - The AI's response
 */
export async function queryHuggingFace(prompt) {
    if (!HF_API_KEY) {
        throw new Error("HUGGINGFACE_API_KEY is missing in .env.local");
    }

    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.7,
                        top_p: 0.95,
                        return_full_text: false,
                    },
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to fetch from Hugging Face");
        }

        // Hugging Face returns an array of objects for text generation
        return result[0]?.generated_text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Hugging Face API Error:", error);
        throw error;
    }
}
