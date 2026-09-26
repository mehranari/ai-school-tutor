import Groq from "groq-sdk";
import { cleanResponse } from "./cleanResponse";

// Fallback model chain in order of priority
const DEFAULT_PRIMARY_MODEL = "qwen/qwen3.6-27b";
const FALLBACK_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768"
];

// Timeout setting per model request (15 seconds)
const REQUEST_TIMEOUT_MS = process.env.GROQ_TIMEOUT_MS
    ? parseInt(process.env.GROQ_TIMEOUT_MS, 10)
    : 15000;

// Token cap to prevent exceeding Groq Output Tokens Per Minute (OTPM)
const MAX_ALLOWED_TOKENS = 1000;

/**
 * Helper to call Groq API with timeout control using AbortController
 */
async function callGroqWithTimeout(groq, model, prompt, maxTokens, timeoutMs) {
    const controller = new AbortController();
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            controller.abort();
            const err = new Error(`Request to model '${model}' timed out after ${timeoutMs / 1000} seconds`);
            err.name = "TimeoutError";
            reject(err);
        }, timeoutMs);
    });

    try {
        const apiPromise = groq.chat.completions.create(
            {
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: model,
                temperature: 0.7,
                max_tokens: maxTokens,
                top_p: 1,
                stream: false,
            },
            { signal: controller.signal }
        );

        return await Promise.race([apiPromise, timeoutPromise]);
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
}

/**
 * Sends a query to the Groq API with fallback model chain and timeout resilience.
 * @param {string} prompt - The student's question or system instruction
 * @returns {Promise<string>} - The cleaned AI response
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

    const groq = new Groq({ apiKey });

    // 2. Build deduplicated fallback model chain
    const configuredPrimary = process.env.GROQ_MODEL || DEFAULT_PRIMARY_MODEL;
    const modelsToTry = Array.from(new Set([configuredPrimary, ...FALLBACK_MODELS].filter(Boolean)));

    // 3. Compute safe max_tokens (capped at 1000)
    const configuredMaxTokens = process.env.GROQ_MAX_TOKENS
        ? parseInt(process.env.GROQ_MAX_TOKENS, 10)
        : 800;
    const safeMaxTokens = Math.min(
        Math.max(isNaN(configuredMaxTokens) ? 800 : configuredMaxTokens, 100),
        MAX_ALLOWED_TOKENS
    );

    let lastError = null;

    // 4. Iterate over fallback chain
    for (const model of modelsToTry) {
        try {
            console.log(`[Groq] Requesting completion using model: ${model} (max_tokens: ${safeMaxTokens}, timeout: ${REQUEST_TIMEOUT_MS}ms)...`);
            
            const chatCompletion = await callGroqWithTimeout(groq, model, prompt, safeMaxTokens, REQUEST_TIMEOUT_MS);
            const responseContent = chatCompletion?.choices?.[0]?.message?.content;

            if (!responseContent) {
                throw new Error(`Model '${model}' completed but returned empty content.`);
            }

            const cleaned = cleanResponse(responseContent);
            if (!cleaned) {
                throw new Error(`Model '${model}' output was empty after sanitization.`);
            }

            console.log(`[Groq] Successfully received response from model: ${model}`);
            return cleaned;

        } catch (error) {
            lastError = error;
            console.warn(`[Groq Warning] Model '${model}' failed or timed out (${error.message}). Trying next fallback model...`);
        }
    }

    // 5. If all models fail, throw a structured error
    console.error("[Groq Error] All models in the fallback chain failed.", lastError);
    const finalError = new Error("The tutor is currently experiencing high demand. Please wait a few seconds and ask again!");
    finalError.status = 503;
    finalError.allModelsFailed = true;
    finalError.cause = lastError;
    throw finalError;
}


