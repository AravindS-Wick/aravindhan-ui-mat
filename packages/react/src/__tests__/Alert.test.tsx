import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from '../Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Something happened');
  });

  it('applies info color class by default', () => {
    render(<Alert>Info</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('av-alert', 'av-alert-color-info');
  });

  it('applies the given color class', () => {
    render(<Alert color="success">Done</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('av-alert-color-success');
  });
});
