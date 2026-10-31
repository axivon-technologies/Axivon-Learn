import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '2rem 1rem', maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Learner Profile
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Your personal learner credentials and registered details.
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>Active Learner</div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email Address</div>
          <div style={{ fontSize: '1rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>learner@axivon.local</div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Platform Role</div>
          <span className="badge badge-primary" style={{ marginTop: '0.35rem' }}>Learner (Role: learner)</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
