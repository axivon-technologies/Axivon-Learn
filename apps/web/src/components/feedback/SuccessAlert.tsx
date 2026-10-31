import React from 'react';

interface SuccessAlertProps {
  title?: string;
  message: string;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  title = 'Success',
  message
}) => {
  return (
    <div
      data-testid="success-alert"
      style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-success-bg)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: 'var(--color-success)',
        margin: '1rem 0'
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{message}</div>
    </div>
  );
};

export default SuccessAlert;
