import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 50% 20%, hsla(245, 82%, 60%, 0.12) 0%, transparent 60%), var(--bg-main)',
      padding: '2rem 1rem'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
          AXIVON <span className="brand-badge">LEARN</span>
        </Link>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Learn. Build. Grow.
        </p>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-surface-elevated)' }}>
        <Outlet />
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>← Back to platform home</Link>
      </div>
    </div>
  );
};

export default AuthLayout;
