export const env = {
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  /**
   * O backend já expõe /auth/login, então o padrão é falar com a API real.
   * `VITE_USE_MOCK_AUTH=true` volta ao login em memória — útil para mexer na tela
   * sem subir Postgres.
   */
  USE_MOCK_AUTH: import.meta.env.VITE_USE_MOCK_AUTH === 'true',
} as const;
