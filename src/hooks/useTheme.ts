import { useSyncExternalStore } from 'react';

export type Tema = 'light' | 'dark';

const STORAGE_KEY = 'nexios.tema';

const listeners = new Set<() => void>();

function prefereEscuro(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function lerTemaSalvo(): Tema | null {
  const salvo = localStorage.getItem(STORAGE_KEY);
  return salvo === 'light' || salvo === 'dark' ? salvo : null;
}

/** Tema efetivo: escolha explícita do usuário, senão a preferência do sistema. */
export function temaAtual(): Tema {
  return lerTemaSalvo() ?? (prefereEscuro() ? 'dark' : 'light');
}

export function aplicarTema(tema: Tema): void {
  document.documentElement.classList.toggle('dark', tema === 'dark');
}

function definirTema(tema: Tema): void {
  localStorage.setItem(STORAGE_KEY, tema);
  aplicarTema(tema);
  listeners.forEach((ouvinte) => ouvinte());
}

function subscribe(ouvinte: () => void): () => void {
  listeners.add(ouvinte);
  return () => {
    listeners.delete(ouvinte);
  };
}

export function useTheme() {
  const tema = useSyncExternalStore(subscribe, temaAtual, () => 'light' as Tema);

  return {
    tema,
    isDark: tema === 'dark',
    alternar: () => definirTema(tema === 'dark' ? 'light' : 'dark'),
    definir: definirTema,
  };
}
