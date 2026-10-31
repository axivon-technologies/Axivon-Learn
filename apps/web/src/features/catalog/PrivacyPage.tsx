import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Privacy Notice
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Effective: 2026-10-31 • Axivon Technologies
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <p>
          At Axivon Technologies, we respect your privacy and process personal data in accordance with strict principles of least-privilege access and data minimization.
        </p>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>Data We Collect</h3>
        <p>
          We collect basic registration information (name, email address) and progress data (completed lessons, quiz attempt results) to enable persistent learning experiences.
        </p>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>Data Confidentiality</h3>
        <p>
          Passwords are cryptographically hashed using industry-standard salt algorithms prior to persistence. Plaintext passwords are never stored, logged, or visible to system administrators.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
