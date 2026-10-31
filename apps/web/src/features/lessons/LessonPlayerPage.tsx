import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export const LessonPlayerPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const [completed, setCompleted] = useState(false);

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      {/* Navigation Breadcrumb */}
      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <Link to={`/courses/${courseSlug}`}>{courseSlug || 'Course'}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)' }}>Lesson View</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Main Player & Notes */}
        <div style={{ flex: '3 1 0%' }}>
          {/* Responsive 16:9 Video Container */}
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border-default)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>▶</div>
              <h4 style={{ fontWeight: 600, color: '#FFFFFF' }}>Embedded Lesson Video</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', marginTop: '0.5rem' }}>
                Curated lecture resource from approved educational partners. Transparent source attribution and permitted embed playback.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Lesson 1.1</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Introduction & Fundamental Concepts</h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setCompleted(!completed)}
                className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}
              >
                {completed ? '✓ Lesson Completed' : 'Mark as Complete'}
              </button>

              <Link to="/quiz/sample-quiz-1" className="btn btn-secondary">
                Take Quiz 📝
              </Link>
            </div>
          </div>

          {/* Lesson Resources & Notes */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>Study Notes & Key Takeaways</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                In this foundational module, we explore the architectural baseline of technology applications, understanding how client layers, server interfaces, and data persistence layers communicate synchronously and asynchronously.
              </p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600 }}>Core Objectives:</h4>
              <ul style={{ paddingLeft: '1.25rem' }}>
                <li>Identify key architectural boundaries in modern distributed systems.</li>
                <li>Understand request lifecycle and state transitions.</li>
                <li>Prepare environment variables and local development tooling.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lesson Sidebar Syllabus Navigation */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Syllabus Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'hsla(245, 82%, 60%, 0.15)', border: '1px solid var(--border-focus)', fontSize: '0.875rem', fontWeight: 600 }}>
                1.1 Introduction & Setup (Current)
              </div>
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                1.2 Core Data Structures
              </div>
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                1.3 Algorithm Foundations
              </div>
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                1.4 Module 1 Assessment Quiz
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <Link to={`/courses/${courseSlug}`} style={{ fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                ← Return to Course Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayerPage;
