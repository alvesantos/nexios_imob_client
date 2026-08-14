import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, normalizarSubdominio } from '../schemas';
import type { LoginFormValues } from '../schemas';
import type { LoginRequest } from '@/types/auth';

type LoginFormProps = {
  onSubmit: (dados: LoginRequest) => void;
  isLoading?: boolean;
  erroServidor?: string | null;
};

export function LoginForm({ onSubmit, isLoading = false, erroServidor }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { subdominio: '', email: '', senha: '' },
  });

  const enviar = handleSubmit((valores) =>
    onSubmit({
      subdominio: normalizarSubdominio(valores.subdominio),
      email: valores.email.trim(),
      senha: valores.senha,
    })
  );

  return (
    <>
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-ink-950 dark:text-white">Entrar</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Acesse o painel da sua imobiliária
        </p>
      </header>

      <form onSubmit={enviar} noValidate className="mt-7 flex flex-col gap-4">
        <Input
          label="Imobiliária"
          placeholder="horizonte.nexiosimob.com.br"
          autoComplete="organization"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isLoading}
          error={errors.subdominio?.message}
          {...register('subdominio')}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="voce@imobiliaria.com.br"
          autoComplete="username"
          disabled={isLoading}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            error={errors.senha?.message}
            {...register('senha')}
          />
          <div className="mt-2 text-right">
            <a
              href="/recuperar-senha"
              className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>

        {erroServidor ? (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {erroServidor}
          </p>
        ) : null}

        <Button type="submit" loading={isLoading} className="mt-1">
          {isLoading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-500 dark:text-ink-400">
        Não tem uma conta?{' '}
        <a
          href="/contato"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Fale com o time comercial
        </a>
      </p>
    </>
  );
}
