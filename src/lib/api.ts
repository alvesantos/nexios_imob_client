import axios from 'axios';
import { env } from './env';
import { clearSession, getToken } from '@/features/auth/services/session';

export const api = axios.create({
  baseURL: env.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (erro) => {
    const url = erro.config?.url ?? '';
    // Um 401 vindo do próprio login é "senha errada", não sessão expirada —
    // deixar passar para o formulário tratar, sem limpar nada nem redirecionar.
    const ehTentativaDeLogin = url.includes('/auth/login');

    if (erro.response?.status === 401 && !ehTentativaDeLogin) {
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(erro);
  }
);
