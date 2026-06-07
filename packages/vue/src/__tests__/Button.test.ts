import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import Button from '../Button.vue';

describe('Button', () => {
  it('renders slot content', () => {
    render(Button, { slots: { default: 'Click me' } });
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies primary variant class by default', () => {
    render(Button, { slots: { default: 'Test' } });
    expect(screen.getByRole('button')).toHaveClass('av-btn', 'av-btn-primary');
  });

  it('applies the given variant class', () => {
    render(Button, { props: { variant: 'danger' }, slots: { default: 'Delete' } });
    expect(screen.getByRole('button')).toHaveClass('av-btn-danger');
  });

  it('applies size class when not md', () => {
    render(Button, { props: { size: 'lg' }, slots: { default: 'Large' } });
    expect(screen.getByRole('button')).toHaveClass('av-btn-lg');
  });

  it('applies loading class when loading=true', () => {
    render(Button, { props: { loading: true }, slots: { default: 'Wait' } });
    expect(screen.getByRole('button')).toHaveClass('av-btn-loading');
  });

  it('applies block class when block=true', () => {
    render(Button, { props: { block: true }, slots: { default: 'Full' } });
    expect(screen.getByRole('button')).toHaveClass('av-btn-block');
  });

  it('is disabled when disabled=true', () => {
    render(Button, { props: { disabled: true }, slots: { default: 'Disabled' } });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
