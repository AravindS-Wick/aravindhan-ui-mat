import { useState, useEffect, useCallback, useRef } from 'react';
import { cls } from './types';

export interface CountdownProps {
  /** Target date/time to count down to. */
  targetDate?: Date | string | number | Record<string, unknown>;
  /** Initial seconds (used when targetDate not provided). */
  seconds?: number;
  /** Auto-start. Defaults to true. */
  autoStart?: boolean;
  /** Show days segment. Defaults to true. */
  showDays?: boolean;
  /** Called when countdown reaches zero. */
  onComplete?: () => void;
  /** Called every tick with remaining seconds. */
  onTick?: (remaining: number) => void;
  /** Render as compact string instead of digit blocks. */
  compact?: boolean;
  className?: string;
}

interface Segments { days: number; hours: number; minutes: number; seconds: number }

function toSegments(ms: number): Segments {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function isValidDateInput(d: any): boolean {
  if (d instanceof Date && !isNaN(d.getTime())) return true;
  if (typeof d === 'string' || typeof d === 'number') {
    return !isNaN(new Date(d).getTime());
  }
  return false;
}

function toValidDate(d: any): Date {
  if (d instanceof Date) return d;
  return new Date(d as string | number);
}

export function Countdown({
  targetDate,
  seconds: initialSeconds,
  autoStart = true,
  showDays = true,
  onComplete,
  onTick,
  compact = false,
  className = '',
}: CountdownProps) {
  const getMs = useCallback(() => {
    if (isValidDateInput(targetDate)) {
      return toValidDate(targetDate).getTime() - Date.now();
    }
    return (initialSeconds ?? 0) * 1000;
  }, [targetDate, initialSeconds]);

  const [remaining, setRemaining] = useState(getMs);
  const [running, setRunning] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);
  onCompleteRef.current = onComplete;
  onTickRef.current = onTick;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = isValidDateInput(targetDate) ? toValidDate(targetDate).getTime() - Date.now() : prev - 1000;
        if (next <= 0) {
          clearInterval(id);
          setRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        onTickRef.current?.(Math.floor(next / 1000));
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, targetDate]);

  const seg = toSegments(remaining);
  const done = remaining <= 0;

  const start = () => { if (!done) setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setRemaining(getMs()); };

  if (compact) {
    const parts = [
      showDays && seg.days > 0 && `${seg.days}d`,
      `${pad(seg.hours)}h`,
      `${pad(seg.minutes)}m`,
      `${pad(seg.seconds)}s`,
    ].filter(Boolean);
    return (
      <span className={cls('av-countdown av-countdown-compact', done && 'av-countdown-done', className)}>
        {done ? '00:00:00' : parts.join(' ')}
      </span>
    );
  }

  const blocks: { label: string; value: number }[] = [
    ...(showDays ? [{ label: 'Days', value: seg.days }] : []),
    { label: 'Hours', value: seg.hours },
    { label: 'Min', value: seg.minutes },
    { label: 'Sec', value: seg.seconds },
  ];

  return (
    <div className={cls('av-countdown', done && 'av-countdown-done', className)}>
      <div className="av-countdown-blocks">
        {blocks.map(({ label, value }) => (
          <div key={label} className="av-countdown-block">
            <span className="av-countdown-value">{pad(value)}</span>
            <span className="av-countdown-label">{label}</span>
          </div>
        ))}
      </div>
      <div className="av-countdown-controls">
        {!running && !done && (
          <button type="button" className="av-btn av-btn-sm av-btn-primary" onClick={start}>Start</button>
        )}
        {running && (
          <button type="button" className="av-btn av-btn-sm av-btn-secondary" onClick={pause}>Pause</button>
        )}
        <button type="button" className="av-btn av-btn-sm av-btn-ghost" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
