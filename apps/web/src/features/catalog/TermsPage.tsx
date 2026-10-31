import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Effective: 2026-10-31 • Axivon Technologies
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <p>
          By accessing or using the AXIVON LEARN platform, you agree to comply with all acceptable use guidelines and intellectual property policies set forth by Axivon Technologies.
        </p>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>Educational Platform Scope</h3>
        <p>
          AXIVON LEARN provides technical learning paths, assessments, and reference curriculum for educational purposes. Course enrollment does not guarantee employment, academic accreditation, or specific third-party credentials unless expressly documented in writing.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
