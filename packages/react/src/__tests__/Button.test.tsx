import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies primary variant class by default', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('av-btn', 'av-btn-primary');
  });

  it('applies the given variant class', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('av-btn-danger');
  });

  it('applies size class when not md', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('av-btn-lg');
  });

  it('does not apply size class for md (default)', () => {
    render(<Button size="md">Default</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('av-btn-md');
  });

  it('applies loading class and disables when loading', () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('av-btn-loading');
    expect(btn).toBeDisabled();
  });

  it('applies block class when block=true', () => {
    render(<Button block>Full width</Button>);
    expect(screen.getByRole('button')).toHaveClass('av-btn-block');
  });

  it('merges extra className', () => {
    render(<Button className="my-custom">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('my-custom');
  });

  it('fires onClick when clicked', async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });
});
