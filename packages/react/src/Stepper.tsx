import type { HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface StepItem {
  /** Step label. */
  label: ReactNode;
  /** Optional description. */
  description?: ReactNode;
  /** Optional icon. Overrides default step number. */
  icon?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Step definitions. */
  steps: StepItem[];
  /** Active step index (0-indexed). */
  activeStep: number;
  /** Orientation. Defaults to `'horizontal'`. */
  orientation?: 'horizontal' | 'vertical';
  /** Show check icon for completed steps. */
  showCompleted?: boolean;
}

export function Stepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  showCompleted = true,
  className = '',
  ...props
}: StepperProps) {
  return (
    <div
      className={cls('av-stepper', `av-stepper-${orientation}`, className)}
      aria-label="Progress steps"
      {...props}
    >
      {steps.map((step, i) => {
        const completed = i < activeStep;
        const active = i === activeStep;
        return (
          <div
            key={i}
            className={cls(
              'av-step',
              completed && 'av-step-completed',
              active && 'av-step-active',
            )}
            aria-current={active ? 'step' : undefined}
          >
            <div className="av-step-indicator">
              {completed && showCompleted ? (
                <span className="av-step-check" aria-label="Completed">✓</span>
              ) : (
                step.icon ?? <span className="av-step-number">{i + 1}</span>
              )}
            </div>
            <div className="av-step-content">
              <div className="av-step-label">{step.label}</div>
              {step.description && <div className="av-step-description">{step.description}</div>}
            </div>
            {i < steps.length - 1 && <div className="av-step-connector" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}
