import { NextRequest, NextResponse } from 'next/server';
import { generatePrompt, Grade, Subject, Curriculum, Mode } from '@/lib/promptTemplates';
import { queryGroq } from '@/lib/groq';

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

    const prompt = `${basePrompt}\n\nIMPORTANT: Respond only in clear standard text paragraphs or standard lists. Do not use mermaid syntax.`;

    // Use Groq API
    let generatedText = await queryGroq(prompt);

    // Clean up the response - remove the prompt if it was included
    if (generatedText.includes(prompt)) {
      generatedText = generatedText.replace(prompt, '').trim();
    }

    // SYSTEM SAFEGUARD: Forcefully strip out any mermaid code block markers if the AI ignored instructions
    if (generatedText.includes('```mermaid')) {
      // Replaces the markdown tag to render it as standard text so the frontend won't crash
      generatedText = generatedText.replaceAll('```mermaid', '```text\n[Diagram Note: Structural View]\n');
    }

    return NextResponse.json({
      response: generatedText || 'Sorry, I could not generate a response. Please try again.',
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        response: 'An error occurred while processing your request. Please check your API key and try again.'
      },
      { status: 500 }
    );
  }
}