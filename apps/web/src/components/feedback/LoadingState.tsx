import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading curriculum content...',
  count = 3
}) => {
  return (
    <div className="feedback-box" data-testid="loading-state" role="status" aria-live="polite">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '48px', width: '100%' }} />
        ))}
      </div>
      <p className="feedback-desc" style={{ marginTop: '1rem' }}>{message}</p>
    </div>
  );
};

export default LoadingState;
