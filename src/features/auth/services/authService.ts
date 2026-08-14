import { api } from '@/lib/api';
import { env } from '@/lib/env';
import type { LoginRequest, LoginResponse, Usuario } from '@/types/auth';
import { loginMock, meMock } from './authService.mock';

/**
 * Contrato-alvo do backend (ver specs/001-tela-login.md §4). Enquanto os endpoints
 * não existem, `VITE_USE_MOCK_AUTH` desvia para a implementação em memória — a
 * escolha morre aqui, nenhum hook ou componente sabe qual está ativa.
 */

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (env.USE_MOCK_AUTH) return loginMock(payload);

  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}

export async function me(): Promise<Usuario> {
  if (env.USE_MOCK_AUTH) return meMock();

  const { data } = await api.get<Usuario>('/auth/me');
  return data;
}
