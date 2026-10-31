import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export const LearnerLayout: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Subheader / Learner Bar */}
      <div style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem 0' }}>
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-primary">Learner Portal</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/dashboard" className={`btn btn-sm ${isCurrent('/dashboard') ? 'btn-primary' : 'btn-ghost'}`}>
                Dashboard
              </Link>
              <Link to="/my-learning" className={`btn btn-sm ${isCurrent('/my-learning') ? 'btn-primary' : 'btn-ghost'}`}>
                My Courses
              </Link>
              <Link to="/profile" className={`btn btn-sm ${isCurrent('/profile') ? 'btn-primary' : 'btn-ghost'}`}>
                Profile
              </Link>
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Status: <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Active Learner Session</span>
          </div>
        </div>
      </div>

      <main className="main-content" style={{ padding: '2rem 0' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default LearnerLayout;
