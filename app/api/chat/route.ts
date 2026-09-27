import { NextRequest, NextResponse } from 'next/server';
import { generatePrompt, Grade, Subject, Curriculum, Mode } from '@/lib/promptTemplates';
import { queryGroq } from '@/lib/groq';
import { cleanResponse } from '@/lib/cleanResponse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grade, subject, curriculum, mode, question } = body;

    // Validate required fields
    if (!grade || !subject || !curriculum || !mode || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: grade, subject, curriculum, mode, question' },
        { status: 400 }
      );
    }

    // Validate GROQ key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please set GROQ_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Generate the base prompt using our template
    const basePrompt = generatePrompt({
      grade: grade as Grade,
      subject: subject as Subject,
      curriculum: curriculum as Curriculum,
      mode: mode as Mode,
      studentQuestion: question,
    });

    // Use Groq API
    let generatedText = await queryGroq(basePrompt);
    generatedText = cleanResponse(generatedText);

    // Clean up the response - remove the prompt if it was included
    if (generatedText.includes(basePrompt)) {
      generatedText = generatedText.replace(basePrompt, '').trim();
    }

    return NextResponse.json({
      response: generatedText || 'Sorry, I could not generate a response. Please try again.',
    });

  } catch (error: any) {
    console.error('[/api/chat Error]:', {
      status: error?.status || 500,
      message: error?.message,
      stack: error?.stack,
    }, error);

    const isApiKeyError = error?.message?.includes('GROQ_API_KEY');
    if (isApiKeyError) {
      return NextResponse.json(
        {
          error: 'Configuration Error',
          message: 'GROQ_API_KEY is not defined or invalid.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Service busy',
        message: 'High demand, please try again.',
      },
      { status: 503 }
    );
  }
}

