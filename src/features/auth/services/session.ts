import type { Usuario } from '@/types/auth';

const CHAVE_TOKEN = 'nexios.token';
const CHAVE_USUARIO = 'nexios.usuario';

/**
 * Único ponto do app que toca o localStorage de sessão. Trocar a estratégia de
 * armazenamento (cookie httpOnly + refresh, por exemplo) é uma mudança só aqui.
 */

export function getToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function getUsuario(): Usuario | null {
  const bruto = localStorage.getItem(CHAVE_USUARIO);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as Usuario;
  } catch {
    // Storage corrompido não pode travar o boot do app.
    clearSession();
    return null;
  }
}

export function setSession(token: string, usuario: Usuario): void {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

export function clearSession(): void {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}
