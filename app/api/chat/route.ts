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

    // CRITICAL REINFORCEMENT: Explicitly ban code block structures that break frontends
    const prompt = `${basePrompt}\n\nIMPORTANT FORMATTING RULES:\n1. Respond using only simple standard text paragraphs, bold text, or clean bullet points.\n2. Do not use markdown code block tags (\`\`\`).\n3. Absolutely never output any graphs, diagrams, schemas, or text resembling flowchart directions.`;

    // Use Groq API
    let generatedText = await queryGroq(prompt);

    // Clean up the response - remove the prompt if it was included
    if (generatedText.includes(prompt)) {
      generatedText = generatedText.replace(prompt, '').trim();
    }

    // BRUTE FORCE SYSTEM SAFEGUARDS: Safely clean out any structural code segments
    if (generatedText.includes('```')) {
      // Remove all code block markers completely to protect the Markdown parser from failing
      generatedText = generatedText.replace(/```[a-z]*/g, '');
    }

    // Catch any leftover keywords that could trigger a diagram execution sequence
    if (generatedText.toLowerCase().includes('graph td') || generatedText.toLowerCase().includes('sequencediagram')) {
      generatedText = "Here is the clear explanation for your study topic:\n\n" +
        generatedText.replace(/graph\s+\w+/gi, '').replace(/subgraph/gi, '');
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