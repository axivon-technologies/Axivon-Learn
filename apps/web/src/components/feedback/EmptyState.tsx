import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No content available',
  description = 'There are currently no items matching your criteria in this section.',
  actionLabel,
  actionLink,
  icon
}) => {
  return (
    <div className="feedback-box" data-testid="empty-state">
      {icon && <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{icon}</div>}
      <h3 className="feedback-title">{title}</h3>
      <p className="feedback-desc">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
