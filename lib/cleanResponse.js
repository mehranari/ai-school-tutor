/**
 * lib/cleanResponse.js
 * Sanitizes and cleans AI model output before sending it to the client.
 * Strips internal thinking/reasoning tags (<think>...</think>), prompt echoes, instruction tags, etc.
 * 
 * @param {string} text - Raw AI model output
 * @returns {string} - Cleaned student-facing markdown text
 */
export function cleanResponse(text) {
    if (!text || typeof text !== "string") return "";

    let cleaned = text;

    // 1. Strip internal reasoning/thinking blocks (<think>...</think> or <reasoning>...</reasoning>)
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");
    cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "");

    // 2. Strip leftover unclosed <think> or <reasoning> tags (e.g. truncated outputs)
    cleaned = cleaned.replace(/<think>[\s\S]*/gi, "");
    cleaned = cleaned.replace(/<reasoning>[\s\S]*/gi, "");

    // 3. Remove leftover Llama/Mistral/ChatML instruction tags
    cleaned = cleaned.replace(/\[\/?INST\]/gi, "");
    cleaned = cleaned.replace(/<\|im_start\|>[\s\S]*?<\|im_end\|>/gi, "");
    cleaned = cleaned.replace(/<\|im_start\|>/gi, "");
    cleaned = cleaned.replace(/<\|im_end\|>/gi, "");
    cleaned = cleaned.replace(/<\|system\|>/gi, "");
    cleaned = cleaned.replace(/<\|user\|>/gi, "");
    cleaned = cleaned.replace(/<\|assistant\|>/gi, "");

    // 4. Normalize multiple consecutive newlines (max 2 consecutive newlines)
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    return cleaned.trim();
}

