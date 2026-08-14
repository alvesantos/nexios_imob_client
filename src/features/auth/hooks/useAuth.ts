import { use } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const contexto = use(AuthContext);

  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  }

  return contexto;
}
