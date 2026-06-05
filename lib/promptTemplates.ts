// lib/promptTemplates.js (or .ts — works as either)
// Advanced prompt generator for TutorGem AI Tutor

export function getGradeLanguageLevel(grade) {
  if (grade <= 3) return "Use very simple words and short sentences for early primary students (age 6-8).";
  if (grade <= 6) return "Use clear, simple language suitable for elementary students (age 9-12).";
  if (grade <= 8) return "Use moderately complex language for middle school students (age 12-14).";
  return "Use academic language with thorough detail suitable for high school students (age 14-17).";
}

function getSubjectInstructions(subject) {
  const diagrams = `ALWAYS include a Mermaid diagram when explaining a process, flow, or relationship. Use this exact format:
\`\`\`mermaid
graph TD
    A[Start] --> B[Step 1]
    B --> C[Step 2]
\`\`\``;

  const images = `ALWAYS include one illustrative image using this exact format:
![Description of concept](https://pollinations.ai/p/educational_diagram_of_TOPIC?width=700&height=400&nologo=true)
Replace TOPIC with the actual subject matter.`;

  switch (subject) {
    case "Maths":
      return `SUBJECT RULES FOR MATHS:
- ${diagrams}
- Use LaTeX for ALL formulas: inline $formula$ or block $$formula$$
- Structure: **Rule/Formula** → **Worked Example** → **Practice Tips**
- Use numbered steps for solutions
- ${images}`;

    case "Physics":
      return `SUBJECT RULES FOR PHYSICS:
- ${diagrams}
- Use LaTeX for equations: $F = ma$, $E = mc^2$
- Structure: **Law/Principle** → **Real-World Example** → **Formula** → **Solved Problem**
- ${images}`;

    case "Chemistry":
      return `SUBJECT RULES FOR CHEMISTRY:
- ${diagrams}
- Use LaTeX for equations
- Structure: **Concept** → **Reaction/Process** → **Example** → **Key Points**
- ${images}`;

    case "Biology":
      return `SUBJECT RULES FOR BIOLOGY:
- ${diagrams}
- Structure: **Definition** → **How It Works** → **Diagram** → **Real Example**
- ${images}`;

    case "English":
      return `SUBJECT RULES FOR ENGLISH:
- Use Mermaid mindmaps for concepts: \`\`\`mermaid\nmindmap\n  root((Topic))\n\`\`\`
- Structure: **Definition** → **Example** → **How To Use** → **Common Mistakes**
- ${images}`;

    default:
      return `SUBJECT RULES:
- ${diagrams}
- ${images}
- Use structured sections with clear headings`;
  }
}

export function generatePrompt({ grade, subject, curriculum, mode, studentQuestion }) {
  const gradeLanguage = getGradeLanguageLevel(grade);
  const subjectInstructions = getSubjectInstructions(subject);

  const modeInstructions = mode === "exam_paper"
    ? `Generate a complete exam paper on "${studentQuestion}" with:
## 📋 Section A — MCQs (5 questions, 1 mark each)
## ✍️ Section B — Short Questions (3 questions, 3 marks each)  
## 📝 Section C — Long Questions (2 questions, 5 marks each)
Mark scheme at the end.`
    : `Explain "${studentQuestion}" for Grade ${grade} ${subject} students.

MANDATORY RESPONSE STRUCTURE — follow this EXACTLY:

## 📌 Quick Overview
Write 2-3 sentences summarizing the key answer.

## 🎯 Key Points
- Point 1 (most important)
- Point 2
- Point 3
- Point 4

## 📖 Detailed Explanation
Full explanation with sub-headings. Use **bold** for key terms.

## 📊 Diagram / Visual
[Include Mermaid diagram here if applicable]
[Include image here]

## 💡 Real-World Example
A practical, relatable example for a Grade ${grade} student.

## ✅ Summary
A concise recap in 2-3 sentences.

## 🚀 Practice Challenge
One practice question for the student to try.`;

  return `You are a World-Class Curriculum Author and Expert ${subject} Teacher for Grade ${grade} students.

${gradeLanguage}

${subjectInstructions}

FORMATTING RULES — MANDATORY:
1. Use Markdown headers (##, ###) for sections
2. Use **bold** for key terms and concepts
3. Use bullet points (- ) for lists — never write walls of text
4. Use tables for comparisons
5. Use > blockquotes for important notes/rules
6. Keep paragraphs SHORT — max 3-4 lines each
7. ALWAYS include a Mermaid diagram for process/flow topics
8. ALWAYS include a Pollinations.ai image for visual topics
9. LaTeX: inline $formula$ for math/science equations

TASK:
${modeInstructions}

Your expert educational response:`;
}

// TypeScript type exports (ignored by JS, used by TS files)
export type Grade = number;
export type Subject = string;
export type Curriculum = string;
export type Mode = string;