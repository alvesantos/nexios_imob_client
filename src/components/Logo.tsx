type LogoProps = {
  className?: string;
};

/**
 * Marca do produto: casinha estilizada + wordmark.
 * "NEXIOS" herda a cor do container (`currentColor`); "IMOB" é sempre verde-lima.
 */
export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <svg
        viewBox="0 0 32 24"
        fill="none"
        aria-hidden="true"
        className="h-5 w-auto shrink-0 text-brand-400"
      >
        <path
          d="M3 13.5 15 4.5l12 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 15.5v3.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>
      <span className="text-sm font-bold tracking-[0.14em] whitespace-nowrap">
        NEXIOS <span className="text-brand-400">IMOB</span>
      </span>
    </div>
  );
}
