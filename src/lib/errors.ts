import axios from 'axios';

/** Erro com status HTTP produzido fora do axios (ex.: a camada mock de auth). */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Status HTTP de um erro, venha ele do axios ou do mock. `null` = falha de rede. */
export function statusDoErro(erro: unknown): number | null {
  if (erro instanceof ApiError) return erro.status;
  if (axios.isAxiosError(erro)) return erro.response?.status ?? null;
  return null;
}
