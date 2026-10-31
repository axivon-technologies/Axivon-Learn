import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while communicating with the service. Please try again.',
  onRetry
}) => {
  return (
    <div className="feedback-box" data-testid="error-state" style={{ borderColor: 'var(--color-danger)' }}>
      <h3 className="feedback-title" style={{ color: 'var(--color-danger)' }}>{title}</h3>
      <p className="feedback-desc">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--color-danger)' }}>
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
