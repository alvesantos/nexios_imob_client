export const PAPEIS = ['gestor', 'corretor', 'financeiro', 'super_admin', 'root'] as const;

export type PapelUsuario = (typeof PAPEIS)[number];

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  imobiliaria_id: string | null;
  avatar_url: string | null;
};

export type LoginRequest = {
  subdominio: string;
  email: string;
  senha: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  usuario: Usuario;
};
