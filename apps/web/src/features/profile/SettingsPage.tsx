import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '2rem 1rem', maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Account Settings
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Manage platform preferences and notifications.
      </p>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Preferences</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Standard account settings are enabled. Security preferences conform to Axivon Technologies internal guidelines.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
