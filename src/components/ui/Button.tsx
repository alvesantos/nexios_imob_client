import type { ComponentPropsWithRef, ReactNode } from 'react';

type Variante = 'primary' | 'ghost';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variante?: Variante;
  loading?: boolean;
  children: ReactNode;
};

const VARIANTES: Record<Variante, string> = {
  primary:
    'bg-brand-400 text-ink-950 hover:bg-brand-300 active:bg-brand-500 focus-visible:ring-brand-400/60',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 focus-visible:ring-ink-400/50',
};

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 animate-spin" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Button({
  variante = 'primary',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5',
        'text-sm font-semibold transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-950',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTES[variante],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
