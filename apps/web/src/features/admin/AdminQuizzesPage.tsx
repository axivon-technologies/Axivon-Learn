import React, { useState } from 'react';

export const AdminQuizzesPage: React.FC = () => {
  const [quizzes] = useState([
    { id: 'quiz-1', title: 'Module 1 Assessment: REST & Web Fundamentals', courseTitle: 'Full Stack Web Development', questions: 3, passingScore: 2 },
    { id: 'quiz-2', title: 'Module 1 Assessment: Python & Linear Algebra', courseTitle: 'AI & Machine Learning Foundations', questions: 3, passingScore: 2 }
  ]);

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Quiz & Assessment Manager
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Configure lesson quizzes and passing criteria.
      </p>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.875rem 1rem' }}>Quiz Title</th>
              <th style={{ padding: '0.875rem 1rem' }}>Course Linked</th>
              <th style={{ padding: '0.875rem 1rem' }}>Questions</th>
              <th style={{ padding: '0.875rem 1rem' }}>Passing Score</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{q.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{q.courseTitle}</td>
                <td style={{ padding: '1rem' }}>{q.questions} MCQs</td>
                <td style={{ padding: '1rem' }}>{q.passingScore} Correct ({Math.round((q.passingScore / q.questions) * 100)}%)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuizzesPage;
