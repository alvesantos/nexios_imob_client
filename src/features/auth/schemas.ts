import { z } from 'zod';

const SUFIXO_HOST = '.nexiosimob.com.br';
const SUBDOMINIO_VALIDO = /^[a-z0-9][a-z0-9-]{1,62}$/;

/**
 * O campo "Imobiliária" aceita tanto o rótulo (`horizonte`) quanto o host completo
 * (`horizonte.nexiosimob.com.br`), porque em demonstrações ele vem pré-preenchido com
 * o host. A API sempre recebe só o rótulo.
 */
export function normalizarSubdominio(valor: string): string {
  const limpo = valor.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return limpo.endsWith(SUFIXO_HOST) ? limpo.slice(0, -SUFIXO_HOST.length) : limpo;
}

export const loginSchema = z.object({
  subdominio: z
    .string()
    .min(1, 'Informe a imobiliária')
    .refine((valor) => SUBDOMINIO_VALIDO.test(normalizarSubdominio(valor)), 'Subdomínio inválido'),
  email: z.string().min(1, 'Informe o e-mail').pipe(z.email('E-mail inválido')),
  senha: z.string().min(1, 'Informe a senha').min(8, 'A senha deve ter ao menos 8 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
