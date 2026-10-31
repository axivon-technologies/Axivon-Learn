import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface SystemHealth {
  status: string;
  uptime: number;
  environment: string;
  timestamp: string;
  database: string;
}

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => {
        if (!res.ok) throw new Error('Health check failed');
        return res.json();
      })
      .then((data) => {
        setHealth(data);
        setHealthLoading(false);
      })
      .catch(() => {
        setHealthError(true);
        setHealthLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="app-container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-default)', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--color-secondary)' }}>●</span> Standalone Technology Learning Platform
          </div>

          <h1 className="hero-title">
            Structured Technology Learning.<br />
            <span className="brand-badge">Learn. Build. Grow.</span>
          </h1>

          <p className="hero-subtitle">
            A practical, sequence-driven platform engineered by Axivon Technologies. Master AI/ML, Full Stack Web Development, and real-world project briefs with verifiable progress tracking.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary">
              Explore Course Catalog →
            </Link>
            <Link to="/learning-paths" className="btn btn-secondary">
              View Curated Tracks
            </Link>
          </div>

          {/* Live System Connectivity Badge */}
          <div style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Backend API:</span>
            {healthLoading && <span style={{ color: 'var(--text-dim)' }}>Checking connectivity...</span>}
            {health && (
              <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                ● Connected ({health.status}) • DB: {health.database}
              </span>
            )}
            {healthError && (
              <span style={{ color: 'var(--color-warning)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                ▲ Local API offline or pending startup
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Structured Value Proposition */}
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Why AXIVON LEARN?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              More than a video list. Our curriculum provides structured outcomes, prerequisite mapping, hands-on quizzes, and saved learner state.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Curated Tracks</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                Follow ordered curricula starting from fundamentals up to complex full-stack implementations and AI models.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>📝</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Interactive Quizzes</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                Reinforce core concepts immediately after each lesson with server-graded multiple-choice assessments.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-success)' }}>📈</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Progress Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                Pick up right where you left off. Enrolled courses, lesson completions, and quiz scores persist in your learner profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Learning Paths Preview */}
      <section style={{ padding: 'var(--space-12) 0', background: 'var(--bg-surface)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary">Curated Tracks</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>
                Priority Learning Paths
              </h2>
            </div>
            <Link to="/learning-paths" style={{ color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.9375rem' }}>
              View all tracks →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div className="card card-interactive">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-primary">AI / ML</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>Beginner to Intermediate</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI & Machine Learning Foundations</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                Master Python for Data Science, linear algebra foundations, scikit-learn models, and deep learning fundamentals.
              </p>
              <Link to="/courses" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Explore Syllabus
              </Link>
            </div>

            <div className="card card-interactive">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-primary">Web Development</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>Beginner to Advanced</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>Full Stack Web Development</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                Build scalable web applications from scratch with modern HTML/CSS, React, TypeScript, Node.js, and MongoDB.
              </p>
              <Link to="/courses" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Explore Syllabus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Journey */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
              The AXIVON LEARN Journey
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Four straightforward steps to building job-ready software engineering skills.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontWeight: 700, color: 'var(--color-primary)' }}>1</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Discover</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Explore vetted courses and structured curriculum outcomes.</p>
            </div>

            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontWeight: 700, color: 'var(--color-primary)' }}>2</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Learn</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Watch embedded lessons and study curated learning resources.</p>
            </div>

            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontWeight: 700, color: 'var(--color-primary)' }}>3</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Practice</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Take multiple-choice quizzes and complete project briefs.</p>
            </div>

            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontWeight: 700, color: 'var(--color-primary)' }}>4</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Grow</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track lesson completions and resume anytime from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
