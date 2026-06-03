/**
 * huggingface.js
 * 
 * This file handles the integration with Hugging Face's Mistral-7B-Instruct-v0.2 model.
 * 
 * Requirements:
 * - HUGGINGFACE_API_KEY must be defined in your .env.local file.
 */

/**
 * Sends a query to the Hugging Face Inference API
 * @param {string} prompt - The student's question or the system instruction
 * @returns {Promise<string>} - The AI's response or a friendly error message
 */
export async function queryHuggingFace(prompt) {
    // 1. Configuration constants
    const API_KEY = process.env.HUGGINGFACE_API_KEY;
    const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";
    const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

    // 2. Validate API Key
    const placeholders = ["hf_your_key_here", "your_hf_token_here", "your_huggingface_api_key_here"];
    if (!API_KEY || placeholders.includes(API_KEY)) {
        console.error("DEBUG: HUGGINGFACE_API_KEY is missing or not set in .env.local");
        return "I'm sorry, I'm having trouble connecting to my brain! (API Key missing. Please set HUGGINGFACE_API_KEY in .env.local)";
    }

    try {
        console.log(`[HuggingFace] Requesting ${MODEL_ID}...`);

        // 3. Prepare the API Request
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    temperature: 0.7,
                    max_new_tokens: 800,
                    top_p: 0.9,
                    return_full_text: false,
                },
                options: {
                    wait_for_model: true,
                }
            }),
        });

        // 4. Handle technical API errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[HuggingFace Error] Status: ${response.status}`, errorData);

            if (response.status === 503) {
                return "The AI teacher is taking a quick break to warm up. Please try again in 10 seconds!";
            }
            if (response.status === 429) {
                return "Wow, lots of students are asking questions right now! Please wait a moment and try again.";
            }

            return `I'm having a bit of trouble right now (Error ${response.status}). Let's try again in a moment!`;
        }

        // 5. Parse the successful response
        const data = await response.json();

        let result = "";
        if (Array.isArray(data) && data[0]?.generated_text) {
            result = data[0].generated_text;
        } else if (data.generated_text) {
            result = data.generated_text;
        } else {
            console.error("[HuggingFace Error] Unexpected response format:", data);
            return "I understood your question, but I couldn't quite form an answer. Can you try rephrasing?";
        }

        // 6. Final Polish
        // Remove any unintentional instruction tags or the prompt itself if leaked
        return result.replace(/\[\/?INST\]/g, "").trim();

    } catch (error) {
        console.error("[Technical Debug Log]:", error);
        return "Oops! I had a little trouble thinking just now. Let's try that question again!";
    }
}

