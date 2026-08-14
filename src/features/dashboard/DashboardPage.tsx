import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Placeholder. Confirma que a sessão chegou até aqui e permite sair.
 * A tela real do Dashboard é escopo de outro spec.
 */
export function DashboardPage() {
  const { usuario, sair } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <header className="flex items-center justify-between border-b border-ink-200 px-6 py-4 dark:border-ink-800">
        <Logo className="text-ink-950 dark:text-white" />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
          Olá, {usuario?.nome}
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          Perfil: <span className="font-medium text-brand-600 dark:text-brand-400">{usuario?.papel}</span>
        </p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{usuario?.email}</p>

        <Button variante="ghost" onClick={sair} className="mt-10 w-auto">
          Sair
        </Button>
      </main>
    </div>
  );
}
