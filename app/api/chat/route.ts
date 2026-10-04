import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { generatePrompt, Grade, Subject, Curriculum, Mode } from '@/lib/promptTemplates';
import { cleanResponse } from '@/lib/cleanResponse';

const SYSTEM_PROMPT = `You are Expert AI Tutor, a master academic instructor. Your primary job is to deliver highly structured, comprehensive, and pedagogical explanations for every topic requested.

For EVERY response, you MUST structure your answer into the following explicit sections:

1. 📌 Quick Overview & Core Concept
   - Clear, concise definition of the subject/concept.

2. 💡 Real-World Analogy
   - A clear, relatable real-world comparison or mental model to make the concept intuitive.

3. 📐 Mathematical Formula & Variables (if applicable)
   - State standard formulas clearly. Define every single variable and unit.

4. 📊 Conceptual Visual / Diagram
   - Provide an ASCII chart, box diagram, or text-based visual map representing the concept visually.

5. 🔬 Practical Step-by-Step Example / Worked Problem
   - Walk through a complete real-world calculation, scenario, or practical application step-by-step.

6. 🎯 Key Takeaways & Exam Tips
   - Bullet points highlighting crucial facts, common pitfalls, or key points to remember for exams.

Ensure all outputs are detailed, well-spaced with clear headings, and avoid brief summary-only responses.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grade, subject, curriculum, mode, question } = body;

    if (!grade || !subject || !curriculum || !mode || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: grade, subject, curriculum, mode, question' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        response: 'DEBUG API ERROR: GROQ_API_KEY environment variable is not defined or invalid.',
        text: 'DEBUG API ERROR: GROQ_API_KEY environment variable is not defined or invalid.',
      }, { status: 200 });
    }

    const groq = new Groq({ apiKey });

    const basePrompt = generatePrompt({
      grade: grade as Grade,
      subject: subject as Subject,
      curriculum: curriculum as Curriculum,
      mode: mode as Mode,
      studentQuestion: question,
    });

    const MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
    let lastError: any = null;
    let cleaned = '';

    for (const model of MODELS) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: basePrompt }
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 1200,
          stream: false,
        });

        const responseContent = chatCompletion.choices[0]?.message?.content || '';
        cleaned = cleanResponse(responseContent);
        if (cleaned) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Groq Chat Route Warning] Model '${model}' failed:`, err?.message || err);
      }
    }

    if (!cleaned && lastError) {
      throw lastError;
    }

    return NextResponse.json({
      response: cleaned || 'Empty response returned from model.',
      text: cleaned || 'Empty response returned from model.',
    }, { status: 200 });

  } catch (error: any) {
    console.error('[DEBUG API ERROR]:', error);
    const errorDetails = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json({
      response: `DEBUG API ERROR: ${errorDetails}`,
      text: `DEBUG API ERROR: ${errorDetails}`,
    }, { status: 200 });
  }
}


