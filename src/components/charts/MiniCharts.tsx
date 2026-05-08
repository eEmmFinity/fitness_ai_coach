'use client';

import React, { useId } from 'react';

interface SeriesPoint {
  date: string;
  value: number;
}

interface ChartProps {
  data: SeriesPoint[];
  height?: number;
  className?: string;
  /** "primary" | "accent" — picks the gradient stops */
  tone?: 'primary' | 'accent';
}

const W = 600;
const PAD = 6;

const TONES = {
  primary: { from: 'hsl(258, 90%, 70%)', to: 'hsl(270, 95%, 60%)' },
  accent: { from: 'hsl(190, 95%, 55%)', to: 'hsl(165, 85%, 50%)' },
} as const;

function buildPath(data: SeriesPoint[], height: number) {
  if (data.length === 0) return { path: '', area: '' };
  const max = Math.max(1, ...data.map((d) => d.value));
  const xStep = (W - PAD * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => {
    const x = PAD + i * xStep;
    const y = height - PAD - (d.value / max) * (height - PAD * 2);
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  const area = `${path} L${points[points.length - 1][0].toFixed(1)},${
    height - PAD
  } L${points[0][0].toFixed(1)},${height - PAD} Z`;
  return { path, area };
}

export function Sparkline({
  data,
  height = 60,
  tone = 'primary',
  className,
}: ChartProps) {
  const id = useId();
  const { path, area } = buildPath(data, height);
  const t = TONES[tone];
  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={className}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
    >
      <defs>
        <linearGradient id={`stroke-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor={t.to} />
        </linearGradient>
        <linearGradient id={`fill-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.from} stopOpacity="0.35" />
          <stop offset="100%" stopColor={t.to} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path
        d={path}
        fill="none"
        stroke={`url(#stroke-${id})`}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BarSeries({
  data,
  height = 80,
  tone = 'primary',
  className,
}: ChartProps) {
  const id = useId();
  if (data.length === 0) return null;
  const max = Math.max(1, ...data.map((d) => d.value));
  const slot = (W - PAD * 2) / data.length;
  const barWidth = Math.max(2, slot * 0.65);
  const t = TONES[tone];
  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={className}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
    >
      <defs>
        <linearGradient id={`bar-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.from} stopOpacity="1" />
          <stop offset="100%" stopColor={t.to} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - PAD * 2);
        const x = PAD + i * slot + (slot - barWidth) / 2;
        const y = height - PAD - h;
        const empty = d.value === 0;
        return (
          <rect
            key={d.date}
            x={x}
            y={empty ? height - PAD - 2 : y}
            width={barWidth}
            height={empty ? 2 : Math.max(0, h)}
            fill={empty ? 'currentColor' : `url(#bar-${id})`}
            opacity={empty ? 0.18 : 1}
            rx={2}
          />
        );
      })}
    </svg>
  );
}
