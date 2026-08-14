import { ApiError } from '@/lib/errors';
import type { LoginRequest, LoginResponse, Usuario } from '@/types/auth';
import { getUsuario } from './session';

/**
 * Substituto em memória para `POST /auth/login` enquanto o backend não expõe o
 * endpoint. Espelha as credenciais reais do seed (`app/db/seed.py`) e os mesmos
 * status HTTP do contrato, para que a troca pelo serviço real não mude nada acima.
 */

type Conta = {
  senha: string;
  usuario: Usuario;
};

const IMOB_HORIZONTE = '2f1b8c40-0000-4000-8000-000000000002';
const IMOB_NEXIOS = '2f1b8c40-0000-4000-8000-000000000001';

const SUBDOMINIOS = new Set(['horizonte', 'nexios', 'belavista']);

const CONTAS: Record<string, Conta> = {
  'horizonte:gestor@horizonimoveis.com.br': {
    senha: 'GestorPassword123!',
    usuario: {
      id: '9a2c1d10-0000-4000-8000-000000000001',
      nome: 'Lucas Mendes (Gestor Horizon)',
      email: 'gestor@horizonimoveis.com.br',
      papel: 'gestor',
      imobiliaria_id: IMOB_HORIZONTE,
      avatar_url: null,
    },
  },
  'horizonte:corretor@horizonimoveis.com.br': {
    senha: 'CorretorPassword123!',
    usuario: {
      id: '9a2c1d10-0000-4000-8000-000000000002',
      nome: 'Juliana Lima (Corretora Horizon)',
      email: 'corretor@horizonimoveis.com.br',
      papel: 'corretor',
      imobiliaria_id: IMOB_HORIZONTE,
      avatar_url: null,
    },
  },
  'nexios:gestor@nexiosimoveis.com.br': {
    senha: 'GestorPassword123!',
    usuario: {
      id: '9a2c1d10-0000-4000-8000-000000000003',
      nome: 'Carlos Eduardo (Gestor)',
      email: 'gestor@nexiosimoveis.com.br',
      papel: 'gestor',
      imobiliaria_id: IMOB_NEXIOS,
      avatar_url: null,
    },
  },
};

const espera = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginMock(payload: LoginRequest): Promise<LoginResponse> {
  await espera(600);

  if (!SUBDOMINIOS.has(payload.subdominio)) {
    throw new ApiError(404, 'Imobiliária não encontrada');
  }

  const conta = CONTAS[`${payload.subdominio}:${payload.email.toLowerCase()}`];
  if (!conta || conta.senha !== payload.senha) {
    throw new ApiError(401, 'Credenciais inválidas');
  }

  return {
    access_token: `mock.${btoa(conta.usuario.id)}.token`,
    token_type: 'bearer',
    usuario: conta.usuario,
  };
}

export async function meMock(): Promise<Usuario> {
  await espera(150);

  const usuario = getUsuario();
  if (!usuario) throw new ApiError(401, 'Não autenticado');

  return usuario;
}
