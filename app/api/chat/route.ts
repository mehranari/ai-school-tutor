import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { generatePrompt, Grade, Subject, Curriculum, Mode } from '@/lib/promptTemplates';
import { cleanResponse } from '@/lib/cleanResponse';

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
          messages: [{ role: 'user', content: basePrompt }],
          model: model,
          temperature: 0.7,
          max_tokens: 300,
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


