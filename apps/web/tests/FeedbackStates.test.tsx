import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoadingState from '../src/components/feedback/LoadingState';
import EmptyState from '../src/components/feedback/EmptyState';
import ErrorState from '../src/components/feedback/ErrorState';
import SuccessAlert from '../src/components/feedback/SuccessAlert';

describe('Frontend Feedback States', () => {
  it('renders LoadingState with custom message', () => {
    render(<LoadingState message="Fetching courses..." count={2} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByText('Fetching courses...')).toBeInTheDocument();
  });

  it('renders EmptyState with call to action', () => {
    render(
      <MemoryRouter>
        <EmptyState
          title="No Results"
          description="Try adjusting your filters"
          actionLabel="Reset"
          actionLink="/courses"
        />
      </MemoryRouter>
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No Results')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders ErrorState with message', () => {
    render(<ErrorState title="Network Error" message="Connection failed." />);
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText('Connection failed.')).toBeInTheDocument();
  });

  it('renders SuccessAlert with message', () => {
    render(<SuccessAlert title="Registered" message="Welcome aboard!" />);
    expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    expect(screen.getByText('Registered')).toBeInTheDocument();
    expect(screen.getByText('Welcome aboard!')).toBeInTheDocument();
  });
});
