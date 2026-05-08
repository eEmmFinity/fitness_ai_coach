import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAdornment?: React.ReactNode;
}

const fieldBase =
  'w-full rounded-md bg-input text-foreground placeholder:text-muted-foreground/70 ' +
  'border border-border h-11 px-4 text-sm ' +
  'transition-[box-shadow,border-color,background] duration-150 ' +
  'focus:outline-none focus:border-primary/60 focus:bg-surface-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { className, label, error, hint, leftAdornment, type = 'text', id, ...props },
    ref
  ) {
    const fid = id ?? `f-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={fid}
            className="block text-sm font-medium mb-1.5 text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftAdornment && (
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none">
              {leftAdornment}
            </span>
          )}
          <input
            id={fid}
            type={type}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              fieldBase,
              leftAdornment && 'pl-10',
              error && 'border-danger/60 focus:border-danger',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { className, label, error, hint, options, id, ...props },
    ref
  ) {
    const fid = id ?? `s-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={fid}
            className="block text-sm font-medium mb-1.5 text-foreground"
          >
            {label}
          </label>
        )}
        <select
          id={fid}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            fieldBase,
            'pr-10 appearance-none',
            "bg-[length:16px] bg-no-repeat bg-[right_12px_center]",
            "bg-[image:url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23a3a3a3%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%200%201%201.06.02L10%2011.06l3.71-3.83a.75.75%200%201%201%201.08%201.04l-4.25%204.39a.75.75%200%200%201-1.08%200L5.21%208.27a.75.75%200%200%201%20.02-1.06z%22%20clip-rule%3D%22evenodd%22/%3E%3C/svg%3E')]",
            error && 'border-danger/60 focus:border-danger',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);
