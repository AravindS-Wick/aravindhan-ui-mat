import { useState, useEffect } from 'react';
import { cls } from './types';

export interface ClockProps {
  /** Controlled date/time. Defaults to live system time. */
  value?: Date | string | number | Record<string, unknown>;
  /** Display as analog clock face. */
  analog?: boolean;
  /** Show seconds hand / digit. Defaults to true. */
  showSeconds?: boolean;
  /** 12-hour format. Defaults to false (24h). */
  hour12?: boolean;
  /** IANA timezone string e.g. 'America/New_York'. Defaults to local. */
  timezone?: string;
  /** Label shown below the time. */
  label?: string;
  /** Size for analog clock in px. Defaults to 160. */
  size?: number;
  className?: string;
}

function formatDigital(date: Date, hour12: boolean, showSeconds: boolean, timezone?: string): string {
  return date.toLocaleTimeString('en-US', {
    hour12,
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' }),
    ...(timezone && { timeZone: timezone }),
  });
}

function getHands(date: Date) {
  const h = date.getHours() % 12;
  const m = date.getMinutes();
  const s = date.getSeconds();
  return {
    hour: (h / 12) * 360 + (m / 60) * 30,
    minute: (m / 60) * 360 + (s / 60) * 6,
    second: (s / 60) * 360,
  };
}

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

export function Clock({
  value,
  analog = false,
  showSeconds = true,
  hour12 = false,
  timezone,
  label,
  size = 160,
  className = '',
}: ClockProps) {
  const [now, setNow] = useState(() => isValidDateInput(value) ? toValidDate(value) : new Date());

  useEffect(() => {
    if (isValidDateInput(value)) { 
      setNow(toValidDate(value)); 
      return; 
    }
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [value]);

  if (analog) {
    const r = size / 2;
    const hands = getHands(now);
    return (
      <div className={cls('av-clock av-clock-analog', className)} style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label={label ?? 'Analog clock'} role="img">
          <circle cx={r} cy={r} r={r - 2} className="av-clock-face" />
          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = r + Math.cos(angle) * (r - 10);
            const y1 = r + Math.sin(angle) * (r - 10);
            const x2 = r + Math.cos(angle) * (r - 18);
            const y2 = r + Math.sin(angle) * (r - 18);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="av-clock-marker" />;
          })}
          {/* Hour hand */}
          <line
            x1={r} y1={r}
            x2={r + Math.sin((hands.hour * Math.PI) / 180) * (r * 0.5)}
            y2={r - Math.cos((hands.hour * Math.PI) / 180) * (r * 0.5)}
            className="av-clock-hand av-clock-hand-hour"
          />
          {/* Minute hand */}
          <line
            x1={r} y1={r}
            x2={r + Math.sin((hands.minute * Math.PI) / 180) * (r * 0.7)}
            y2={r - Math.cos((hands.minute * Math.PI) / 180) * (r * 0.7)}
            className="av-clock-hand av-clock-hand-minute"
          />
          {showSeconds && (
            <line
              x1={r} y1={r}
              x2={r + Math.sin((hands.second * Math.PI) / 180) * (r * 0.8)}
              y2={r - Math.cos((hands.second * Math.PI) / 180) * (r * 0.8)}
              className="av-clock-hand av-clock-hand-second"
            />
          )}
          <circle cx={r} cy={r} r={4} className="av-clock-center" />
        </svg>
        {label && <span className="av-clock-label">{label}</span>}
      </div>
    );
  }

  return (
    <div className={cls('av-clock av-clock-digital', className)}>
      <time className="av-clock-time" dateTime={now.toISOString()}>
        {formatDigital(now, hour12, showSeconds, timezone)}
      </time>
      {label && <span className="av-clock-label">{label}</span>}
    </div>
  );
}
