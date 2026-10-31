import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        About AXIVON LEARN
      </h1>
      <p style={{ fontSize: '1.15rem', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '2rem' }}>
        Learn. Build. Grow.
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <p>
          <strong style={{ color: 'var(--text-main)' }}>AXIVON LEARN</strong> is a standalone technology learning platform from <strong>Axivon Technologies</strong>. We built this platform with one conviction: technology education should be clear, structured, and demonstrable through practical code and assessments.
        </p>
        <p>
          Rather than presenting an endless, uncurated catalog of video links, AXIVON LEARN focuses on deliberate curriculum design, prerequisite clarity, practice quizzes, and verifiable progress tracking.
        </p>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>Strategic Alignment</h3>
        <p>
          Aligned with Axivon Technologies' core capabilities across web & mobile software engineering, AI/ML, cloud services, and automation, AXIVON LEARN bridges the gap between academic theory and real-world engineering excellence.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
