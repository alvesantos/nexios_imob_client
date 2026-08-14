import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginResponse, Usuario } from '@/types/auth';
import { clearSession, getUsuario, setSession } from '../services/session';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hidrata de forma síncrona: sem isso, o ProtectedRoute mandaria o usuário já
  // logado para /login no primeiro render depois de um refresh.
  const [usuario, setUsuario] = useState<Usuario | null>(() => getUsuario());

  const entrar = useCallback((resposta: LoginResponse) => {
    setSession(resposta.access_token, resposta.usuario);
    setUsuario(resposta.usuario);
  }, []);

  const sair = useCallback(() => {
    clearSession();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, isAuthenticated: usuario !== null, entrar, sair }),
    [usuario, entrar, sair]
  );

  return <AuthContext value={valor}>{children}</AuthContext>;
}
