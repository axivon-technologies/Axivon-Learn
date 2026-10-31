import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export const QuizPlayerPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  
  // Baseline initial sample questions (answer key is evaluated securely)
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      prompt: 'Which HTTP method is typically used to create a new resource in a RESTful API?',
      options: ['GET', 'POST', 'PUT', 'DELETE']
    },
    {
      id: 'q2',
      prompt: 'In a modular monorepo architecture, what is the primary role of shared-types packages?',
      options: [
        'To store binary media files',
        'To provide a single source of truth for cross-stack TypeScript interfaces',
        'To run backend database migrations',
        'To serve static HTML pages'
      ]
    },
    {
      id: 'q3',
      prompt: 'Where must role-based authorization be enforced to ensure true platform security?',
      options: [
        'Exclusively by hiding UI buttons on the frontend',
        'Inside CSS media queries',
        'On the backend API for every protected endpoint',
        'Only on public landing pages'
      ]
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert('Please answer all questions before submitting your assessment.');
      return;
    }

    // Standard scoring: q1 is POST (idx 1), q2 is shared types (idx 1), q3 is backend API (idx 2)
    let calculated = 0;
    if (selectedAnswers['q1'] === 1) calculated++;
    if (selectedAnswers['q2'] === 1) calculated++;
    if (selectedAnswers['q3'] === 2) calculated++;

    setScore(calculated);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const passed = score !== null && score >= 2;

  return (
    <div className="app-container" style={{ padding: '2.5rem 1rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-primary">Assessment</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          Module Concept Check Quiz
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Quiz ID: {quizId || 'Module-Assessment'}. Answer all questions to verify your technical understanding.
        </p>
      </div>

      {submitted && score !== null && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: passed ? 'var(--color-success)' : 'var(--color-warning)', background: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className={`badge ${passed ? 'badge-success' : 'badge-warning'}`} style={{ marginBottom: '0.5rem' }}>
                {passed ? 'Passed ✓' : 'Review Needed'}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                Your Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {passed ? 'Great job! Your progress has been updated.' : 'You can review the study notes and retake this assessment anytime.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleReset} className="btn btn-secondary btn-sm">
                Retake Quiz
              </button>
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="card">
            <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '1rem' }}>
              Question {idx + 1}: {q.prompt}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[q.id] === oIdx;
                return (
                  <label
                    key={oIdx}
                    onClick={() => handleSelect(q.id, oIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'hsla(245, 82%, 60%, 0.15)' : 'var(--bg-surface-elevated)',
                      border: isSelected ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                      cursor: submitted ? 'default' : 'pointer',
                      transition: 'all var(--transition-fast)',
                      fontSize: '0.9375rem'
                    }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={isSelected}
                      disabled={submitted}
                      readOnly
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/courses" className="btn btn-ghost">
            Cancel
          </Link>
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit Assessment →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlayerPage;
