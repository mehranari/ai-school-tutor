// Prompt template generator for AI School Tutor
// This file creates dynamic prompts based on grade, subject, curriculum, mode, and student question

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Subject = 'Physics' | 'Maths' | 'Science' | 'Chemistry' | 'Biology' | 'English' | 'History' | 'Geography';
export type Curriculum = 'basic' | 'general';
export type Mode = 'explain' | 'solve' | 'notes' | 'mcqs' | 'exam_paper';

interface PromptParams {
  grade: Grade;
  subject: Subject;
  curriculum: Curriculum;
  mode: Mode;
  studentQuestion: string;
}

// Get grade-appropriate language level
function getGradeLanguageLevel(grade: Grade): string {
  if (grade >= 1 && grade <= 3) {
    return 'Use very simple words, short sentences, and basic vocabulary suitable for early primary students.';
  } else if (grade >= 4 && grade <= 6) {
    return 'Use clear and simple language with easy-to-understand explanations suitable for elementary students.';
  } else if (grade >= 7 && grade <= 8) {
    return 'Use moderately complex language with detailed explanations suitable for middle school students.';
  } else {
    return 'Use appropriate academic language with thorough explanations suitable for high school students.';
  }
}

// Get subject-specific tone and formatting instructions
function getSubjectInstructions(subject: Subject): string {
  switch (subject) {
    case 'Maths':
      return `### 📐 Textbook Mathematical Analysis
- **Standard Coverage**: Follow the structure of standard curriculum books.
- **Visuals**: Use Mermaid diagrams (\`\`\`mermaid) for logic flows AND descriptive images for geometric concepts.
- **Structural Items**: 
  - **Axiom Box**: State the fundamental rule.
  - **Solved Example**: A detailed walkthrough.
- Tone: Educational, precise, and highly structured.`;
    case 'Physics':
      return `### ⚛️ Scientific Visual Guide
- **Visuals**: Use Mermaid (\`\`\`mermaid) for force/process diagrams. Use illustrative pictures for physical setups.
- **Experiment Box**: Describe a simple "Home Experiment".
- **Infographic Style**: Use lists and bold text for "Visual Summaries".
- Tone: Investigative and textbook-accurate.`;
    case 'English':
      return `### 📚 Literary Exploration
- **Mind Map**: Use Mermaid (\`\`\`mermaid) to show character relationships.
- **Visuals**: Use illustrative pictures to set the mood/setting of the literary piece.
- **Word Info-Box**: List 5 high-yield words.
- Tone: Expressive and literary.`;
    default:
      return `### 🎓 Academic Study Guide
- Use Mermaid diagrams (\`\`\`mermaid) for processes.
- Use illustrative pictures to represent the topic visually.`;
  }
}

// Generate prompt based on mode
function generateModeSpecificPrompt(
  mode: Mode,
  grade: Grade,
  subject: Subject,
  studentQuestion: string
): string {
  const subjectSpecific = getSubjectInstructions(subject);

  switch (mode) {
    case 'explain':
      return `Explain the lesson "${studentQuestion}" for Grade ${grade}. 

${subjectSpecific}

#### Textbook Structure:
1. **Header**: Engaging Topic Title.
2. **Key Objectives**: What the student will learn.
3. **Core Explanation**: The main content with sub-headers.
4. **Visual Section**: Include a high-quality illustrative picture AND a Mermaid diagram if possible.
5. **Chapter Summary**: A condensed version of the whole lesson.`;

    case 'solve':
      return `Solution Guide for: "${studentQuestion}"

${subjectSpecific}

#### Detailed Solution Format:
- **Conceptual Grounding**: Theory before solving.
- **Variable Table**: List all knowns and unknowns.
- **Visual Aid**: Use Mermaid for logic flow or an image for the setup.
- **The Journey**: Numbered calculations with LaTeX.
- **Result**: Bold final answer.`;

    case 'notes':
      return `Study Notes on: "${studentQuestion}".

${subjectSpecific}

#### Notes Organization:
- **Major Headers**: For main concepts.
- **Concept Visual**: A high-level Mermaid diagram or illustrative image.
- **Revision Table**: Compare this topic with a related one.`;

    default:
      return `Academic Assistance: "${studentQuestion}"

${subjectSpecific}`;
  }
}

// Main prompt generator
export function generatePrompt(params: PromptParams): string {
  const { grade, subject, curriculum, mode, studentQuestion } = params;

  const gradeLanguage = getGradeLanguageLevel(grade);
  const modePrompt = generateModeSpecificPrompt(mode, grade, subject, studentQuestion);

  return `You are a World-Class Curriculum Designer and Textbook Author specializing in ${subject} for Grade ${grade}. Your task is to provide a response that looks exactly like a high-quality educational book.

BOOK STANDARDS:
- **Diagrams**: ALWAYS try to include a Mermaid diagram (\`\`\`mermaid) for complex concepts.
- **Illustrative Pictures**: ALWAYS include at least one descriptive picture using this format: ![Image Description](https://pollinations.ai/p/[description]?width=800&height=500&nologo=true)
- **Coverage**: Cover "${studentQuestion}" with textbook depth.
- **Formatting**: Use Markdown headers, Bold text, and Tables.
- **Tone**: Professional professor persona.

TEXTBOOK CONTENT:
${modePrompt}

${gradeLanguage}

FINAL FORMATTING RULE:
- ALWAYS use LaTeX for math/science ($...$).
- STRICTLY use \`\`\`mermaid syntax for diagrams.
- ALWAYS use the Pollinations.ai URL format for pictures to represent biological, physical, or historical concepts.
- Make the layout feel premium and visually engaging.

Your expert textbook entry:`;
}

