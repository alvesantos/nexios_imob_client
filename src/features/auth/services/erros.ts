import { statusDoErro } from '@/lib/errors';

const MENSAGENS: Record<number, string> = {
  401: 'E-mail ou senha incorretos.',
  403: 'Esta conta está desativada. Fale com o gestor.',
  404: 'Imobiliária não encontrada.',
  422: 'Dados inválidos. Confira os campos.',
};

export function mensagemDeLoginErro(erro: unknown): string {
  const status = statusDoErro(erro);
  if (status && MENSAGENS[status]) return MENSAGENS[status];
  if (status && status >= 500) return 'Erro no servidor. Tente novamente em instantes.';
  return 'Não foi possível conectar. Tente novamente.';
}
