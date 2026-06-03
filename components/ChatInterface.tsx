'use client';

import { useState, useRef, useEffect } from 'react';
import { Grade, Subject, Curriculum, Mode } from '@/lib/promptTemplates';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  grade: Grade;
  subject: Subject;
  curriculum: Curriculum;
  mode: Mode;
}

export default function ChatInterface({
  grade,
  subject,
  curriculum,
  mode,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade,
          subject,
          curriculum,
          mode,
          question: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response || 'Sorry, I could not generate a response.' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error. Please check your API key and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.welcomeMessage}>
            <h3>Welcome to AI School Tutor! 👋</h3>
            <p>Select your grade, subject, curriculum, and mode, then ask your question below.</p>
            <p style={styles.hint}>
              Example: {mode === 'explain' && 'What is photosynthesis?'}
              {mode === 'solve' && 'Solve: 2x + 5 = 15'}
              {mode === 'notes' && 'Create notes on Newton\'s laws'}
              {mode === 'mcqs' && 'Generate MCQs on the water cycle'}
              {mode === 'exam_paper' && 'Create an exam paper on fractions'}
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage),
            }}
          >
            <div style={styles.messageContent}>
              <strong>{message.role === 'user' ? 'You' : 'AI Tutor'}:</strong>
              <div
                style={styles.messageText}
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={styles.loadingMessage}>
            <div style={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>AI Tutor is thinking...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here... (Press Enter to send)"
          style={styles.textarea}
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            ...styles.sendButton,
            ...(isLoading || !input.trim() ? styles.sendButtonDisabled : {}),
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  welcomeMessage: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  hint: {
    marginTop: '1rem',
    fontStyle: 'italic',
    color: '#888',
  },
  message: {
    maxWidth: '80%',
    padding: '1rem',
    borderRadius: '8px',
    wordWrap: 'break-word',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    color: 'white',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f3f5',
    color: '#333',
  },
  messageContent: {
    lineHeight: '1.6',
  },
  messageText: {
    marginTop: '0.5rem',
  },
  loadingMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    color: '#666',
  },
  loadingDots: {
    display: 'flex',
    gap: '0.5rem',
  },
  inputContainer: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    borderTop: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
  },
  textarea: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  sendButton: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};

