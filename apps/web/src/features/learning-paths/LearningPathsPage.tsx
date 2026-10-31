import React from 'react';
import { Link } from 'react-router-dom';

export const LearningPathsPage: React.FC = () => {
  const paths = [
    {
      id: 'ai-ml-foundations',
      title: 'AI & Machine Learning Foundations',
      description: 'A structured pathway from Python essentials to machine learning algorithms, deep learning neural networks, and model deployment.',
      level: 'Beginner to Intermediate',
      estimatedHours: 40,
      courseCount: 3,
      topics: ['Python', 'NumPy & Pandas', 'Supervised Learning', 'Neural Networks', 'Model Evaluation']
    },
    {
      id: 'full-stack-foundations',
      title: 'Full Stack Web Development',
      description: 'Master full-stack software engineering using modern TypeScript, React, Express, MongoDB, and RESTful API architecture.',
      level: 'Beginner to Advanced',
      estimatedHours: 50,
      courseCount: 4,
      topics: ['HTML5 & CSS3', 'React & Vite', 'Node.js & Express', 'MongoDB & Mongoose', 'Authentication & Deployment']
    }
  ];

  return (
    <div className="app-container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-primary">Curated Sequences</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          Learning Paths
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px' }}>
          Follow step-by-step career tracks. Each track bundles multiple sequenced courses, lesson milestones, and practical assessments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {paths.map((p) => (
          <div key={p.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{p.level}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>⏱ ~{p.estimatedHours} hours</span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              {p.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '1.25rem', flex: '1 0 auto' }}>
              {p.description}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Key Competencies:
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {p.topics.map((t, idx) => (
                  <span key={idx} style={{ background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{p.courseCount} Courses in Sequence</span>
              <Link to="/courses" className="btn btn-primary btn-sm">
                View Track Courses →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathsPage;
