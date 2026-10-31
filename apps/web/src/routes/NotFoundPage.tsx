import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>
        The page or curriculum route you are looking for does not exist or may have been relocated.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Platform Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
