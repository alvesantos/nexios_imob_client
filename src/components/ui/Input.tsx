import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';

type InputProps = ComponentPropsWithRef<'input'> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-erro`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium text-ink-600 dark:text-ink-300"
      >
        {label}
      </label>

      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={[
          'w-full rounded-md border px-3 py-2.5 text-sm transition-colors',
          'bg-ink-50 text-ink-900 placeholder:text-ink-400',
          'dark:bg-ink-900 dark:text-ink-50 dark:placeholder:text-ink-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-400/60',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50 dark:border-red-500'
            : 'border-ink-200 focus:border-brand-400 dark:border-ink-800',
          className ?? '',
        ].join(' ')}
        {...props}
      />

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
