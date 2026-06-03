'use client';

import { Grade, Subject, Curriculum, Mode } from '@/lib/promptTemplates';

interface SelectorsProps {
  grade: Grade;
  subject: Subject;
  curriculum: Curriculum;
  mode: Mode;
  onGradeChange: (grade: Grade) => void;
  onSubjectChange: (subject: Subject) => void;
  onCurriculumChange: (curriculum: Curriculum) => void;
  onModeChange: (mode: Mode) => void;
}

const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const subjects: Subject[] = ['Physics', 'Maths', 'Science', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
const curricula: Curriculum[] = ['basic', 'general'];
const modes: { value: Mode; label: string }[] = [
  { value: 'explain', label: 'Explain Concept' },
  { value: 'solve', label: 'Solve Question' },
  { value: 'notes', label: 'Generate Notes' },
  { value: 'mcqs', label: 'Generate MCQs' },
  { value: 'exam_paper', label: 'Generate Exam Paper' },
];

export default function Selectors({
  grade,
  subject,
  curriculum,
  mode,
  onGradeChange,
  onSubjectChange,
  onCurriculumChange,
  onModeChange,
}: SelectorsProps) {
  return (
    <div className="selectors-container" style={styles.container}>
      <div style={styles.row}>
        <div style={styles.selectorGroup}>
          <label style={styles.label}>Grade:</label>
          <select
            value={grade}
            onChange={(e) => onGradeChange(Number(e.target.value) as Grade)}
            style={styles.select}
          >
            {grades.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.selectorGroup}>
          <label style={styles.label}>Subject:</label>
          <select
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value as Subject)}
            style={styles.select}
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.selectorGroup}>
          <label style={styles.label}>Curriculum:</label>
          <select
            value={curriculum}
            onChange={(e) => onCurriculumChange(e.target.value as Curriculum)}
            style={styles.select}
          >
            {curricula.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.selectorGroup}>
          <label style={styles.label}>Mode:</label>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as Mode)}
            style={styles.select}
          >
            {modes.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
  },
  select: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
};

