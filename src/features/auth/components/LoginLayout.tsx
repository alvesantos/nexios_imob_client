import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LoginHero } from './LoginHero';

export function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1fr_520px] dark:bg-ink-950">
      <LoginHero />

      <main className="relative flex flex-col justify-center px-6 py-12 sm:px-14">
        <ThemeToggle className="absolute top-6 right-6" />

        {/* No mobile o painel de marketing some, então a marca precisa aparecer aqui. */}
        <Logo className="mb-10 text-ink-900 lg:hidden dark:text-white" />

        <div className="w-full max-w-[340px]">{children}</div>
      </main>
    </div>
  );
}
