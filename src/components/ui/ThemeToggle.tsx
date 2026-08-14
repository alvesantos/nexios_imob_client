import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, alternar } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      onClick={alternar}
      className={[
        // Sem `relative` aqui: o Tailwind emite `.relative` depois de `.absolute`,
        // então ele venceria por ordem o posicionamento vindo por `className`.
        'inline-flex h-7 w-13 items-center rounded-full p-1 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60',
        isDark ? 'bg-brand-400' : 'bg-ink-200 dark:bg-ink-700',
        className ?? '',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          isDark ? 'translate-x-6' : 'translate-x-0',
        ].join(' ')}
      >
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-ink-600" aria-hidden="true">
          {isDark ? (
            <path
              d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
              fill="currentColor"
            />
          ) : (
            <>
              <circle cx="8" cy="8" r="3" fill="currentColor" />
              <path
                d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.9 3.1l-1 1M4.1 11.9l-1 1M12.9 12.9l-1-1M4.1 4.1l-1-1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </span>
    </button>
  );
}
