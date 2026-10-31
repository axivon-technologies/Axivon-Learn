import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const MyLearningPage: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          My Learning
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your course enrollments, ongoing modules, and certificates.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setTab('all')}
          className={`btn btn-sm ${tab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Enrolled (1)
        </button>
        <button
          onClick={() => setTab('in-progress')}
          className={`btn btn-sm ${tab === 'in-progress' ? 'btn-primary' : 'btn-secondary'}`}
        >
          In Progress (1)
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`btn btn-sm ${tab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Completed (0)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary">AI / ML</span>
            <span className="badge badge-warning">In Progress</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI & Machine Learning Foundations</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            4 of 12 lessons finished. Next up: Supervised Learning & Regression Models.
          </p>
          <Link to="/learn/ai-ml-foundations/lesson-1" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Resume Learning →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;
