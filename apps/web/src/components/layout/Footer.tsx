import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-root">
      <div className="app-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
              AXIVON <span className="brand-badge">LEARN</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Learn. Build. Grow. A standalone technology-learning platform engineered by Axivon Technologies.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Curriculum
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/courses">Course Catalog</Link></li>
              <li><Link to="/learning-paths">Learning Paths</Link></li>
              <li><Link to="/dashboard">Learner Dashboard</Link></li>
              <li><Link to="/my-learning">My Enrollments</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/about">About Axivon Learn</Link></li>
              <li><Link to="/contact">Support & Contact</Link></li>
              <li><Link to="/admin">Admin Operations</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Legal & Policy
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/privacy">Privacy Notice</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/content-policy">Content Policy</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
          <p>© {new Date().getFullYear()} Axivon Technologies. All rights reserved.</p>
          <p>Standalone Technology Platform • v1.0 MVP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
