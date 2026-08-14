import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center dark:bg-ink-950">
      <p className="text-5xl font-bold text-brand-400">404</p>
      <h1 className="text-lg font-semibold text-ink-950 dark:text-white">Página não encontrada</h1>
      <Link
        to="/dashboard"
        className="mt-2 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
      >
        Voltar ao painel
      </Link>
    </div>
  );
}
