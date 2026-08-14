import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@/types/auth';
import { login } from '../services/authService';
import { mensagemDeLoginErro } from '../services/erros';
import { useAuth } from './useAuth';

export function useLogin() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (dados: LoginRequest) => login(dados),
    onSuccess: (resposta) => {
      entrar(resposta);
      navigate('/dashboard', { replace: true });
    },
  });

  return {
    entrar: mutation.mutate,
    isLoading: mutation.isPending,
    erro: mutation.error ? mensagemDeLoginErro(mutation.error) : null,
  };
}
