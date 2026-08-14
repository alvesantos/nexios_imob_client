import { createContext } from 'react';
import type { LoginResponse, Usuario } from '@/types/auth';

export type AuthContextValue = {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  entrar: (resposta: LoginResponse) => void;
  sair: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
