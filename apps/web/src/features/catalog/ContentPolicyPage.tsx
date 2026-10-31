import React from 'react';

export const ContentPolicyPage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Content & Attribution Policy
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Guidelines on permitted embedding and intellectual property attribution.
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <p>
          AXIVON LEARN strictly respects content creator intellectual property rights. All external video lectures and reference materials utilized across our curriculum adhere to permitted embed terms, Creative Commons licenses, or direct licensing agreements.
        </p>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>Attribution Standards</h3>
        <p>
          Every lesson displaying third-party video content explicitly credits the author, channel, and source URL, ensuring full transparency and adherence to YouTube API and embed policies.
        </p>
      </div>
    </div>
  );
};

export default ContentPolicyPage;
