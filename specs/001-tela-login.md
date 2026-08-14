# Spec 001 — Tela de Login

**Status:** em implementação
**Escopo:** `nexios_imob_client`
**Rota:** `/login`

---

## 1. Objetivo

Primeira tela real do produto. Autentica um usuário dentro de uma imobiliária específica
(multi-tenant) e o leva ao Dashboard.

A tela é a porta de entrada do painel operacional — corretores, gestores e financeiro entram
por aqui. Como a plataforma é multi-imobiliária, o login precisa de **três** informações, não
duas: qual imobiliária, quem é o usuário, e a senha.

**Fora de escopo nesta rodada:** cadastro de conta, recuperação de senha (o link existe mas
aponta para uma rota ainda não construída), 2FA, "lembrar-me", SSO.

---

## 2. Layout

Split de duas colunas em telas grandes, coluna única no mobile.

```
┌────────────────────────────────┬──────────────────────┐
│  [logo] NEXIOS IMOB            │              [◐]     │
│                                │                      │
│                                │   Entrar             │
│  CRM imobiliário com           │   Acesse o painel…   │
│  inteligência artificial.      │                      │
│                                │   Imobiliária        │
│  Centralize clientes, imóveis  │   [_______________]  │
│  e negociações num só lugar —  │   E-mail             │
│  com match automático entre    │   [_______________]  │
│  perfil e portfólio.           │   Senha              │
│                                │   [_______________]  │
│                                │   Esqueci minha senha│
│                                │   [    Entrar     ]  │
│  © 2026 Nexios Imob            │   Não tem conta? …   │
└────────────────────────────────┴──────────────────────┘
      painel escuro (marketing)      painel claro (form)
```

### Breakpoints

| Largura | Comportamento |
| :-- | :-- |
| `< 1024px` (`lg`) | Painel esquerdo escondido. Form ocupa a tela, com o logo acima do título "Entrar". |
| `>= 1024px` | Grid `1fr 520px`. Painel esquerdo flexível, painel direito de largura fixa. |

### Tokens de cor

Definidos via `@theme` em `src/index.css` (Tailwind 4 é CSS-first — **não existe**
`tailwind.config.js` neste projeto).

| Token | Uso |
| :-- | :-- |
| `--color-brand-*` (base `#9ee62b`) | Verde-lima da marca: wordmark "IMOB", botão primário, links, foco. |
| `--color-ink-*` (base `#0a0f0a`) | Quase-pretos do painel de marketing e do modo escuro. |

O painel esquerdo carrega um gradiente radial verde no canto superior esquerdo, esmaecendo
para preto — é o que dá a sensação de "luz" no mockup.

### Tema claro/escuro

Toggle no canto superior direito do painel direito. Controlado por classe `.dark` no
`<html>`, não por media query pura, para que a escolha do usuário vença a preferência do
sistema.

- Estado inicial: `localStorage['nexios.tema']` se existir, senão `prefers-color-scheme`.
- A escolha persiste entre sessões.
- O painel esquerdo já é escuro e não muda; só o painel direito inverte.

---

## 3. Campos e validação

Validação com `zod` + `react-hook-form` (`@hookform/resolvers/zod`). Mensagens em pt-BR,
exibidas abaixo do campo, disparadas no submit e revalidadas em cada mudança.

| Label | Campo | Tipo | Regras | Mensagem de erro |
| :-- | :-- | :-- | :-- | :-- |
| Imobiliária | `subdominio` | text | Obrigatório. Normalizado: `trim` + lowercase, e o sufixo `.nexiosimob.com.br` é removido. Deve casar `^[a-z0-9][a-z0-9-]{1,62}$`. | "Informe a imobiliária" / "Subdomínio inválido" |
| E-mail | `email` | email | Obrigatório, formato de e-mail. | "Informe o e-mail" / "E-mail inválido" |
| Senha | `senha` | password | Obrigatório, mínimo 8 caracteres. | "Informe a senha" / "A senha deve ter ao menos 8 caracteres" |

O usuário pode digitar `horizonte` ou `horizonte.nexiosimob.com.br` — o formulário aceita as
duas formas e envia sempre só o rótulo (`horizonte`). Isso importa porque o campo vem
pré-preenchido com o host completo em ambientes de demonstração.

### Estados da tela

| Estado | O que aparece |
| :-- | :-- |
| Idle | Campos vazios ou pré-preenchidos, botão ativo. |
| Focus | Anel verde-lima no campo focado. |
| Erro de campo | Borda vermelha + texto do erro abaixo. |
| Erro do servidor | Banner vermelho acima do botão, com a mensagem mapeada do status HTTP. |
| Loading | Botão desabilitado, spinner, texto "Entrando…". Campos travados. |

---

## 4. Contrato da API

> **Implementado no backend** — `app/api/v1/endpoints/auth.py`. A camada mock continua
> existindo como atalho de desenvolvimento (§5), mas não é mais o padrão.

**Base URL:** `VITE_API_URL`, padrão `http://localhost:8000/api/v1`.

### `POST /auth/login`

Request:

```json
{
  "subdominio": "horizonte",
  "email": "gestor@horizonimoveis.com.br",
  "senha": "GestorPassword123!"
}
```

`200 OK`:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "usuario": {
    "id": "uuid",
    "nome": "Lucas Mendes (Gestor Horizon)",
    "email": "gestor@horizonimoveis.com.br",
    "papel": "gestor",
    "imobiliaria_id": "uuid",
    "avatar_url": null
  }
}
```

`papel` ∈ `gestor | corretor | financeiro | super_admin | root` — espelha o
`CheckConstraint` de `usuarios.papel` no modelo do backend.

Erros:

| Status | Corpo | Mensagem exibida |
| :-- | :-- | :-- |
| 401 | `{"detail": "Credenciais inválidas"}` | "E-mail ou senha incorretos." |
| 403 | `{"detail": "Usuário inativo"}` | "Esta conta está desativada. Fale com o gestor." |
| 404 | `{"detail": "Imobiliária não encontrada"}` | "Imobiliária não encontrada." |
| 422 | Pydantic | "Dados inválidos. Confira os campos." |
| 5xx / rede | — | "Não foi possível conectar. Tente novamente." |

O motivo de 401 ser genérico ("credenciais inválidas", nunca "senha errada" ou "e-mail não
existe") é não permitir enumeração de usuários. O 404 de imobiliária é aceitável porque o
subdomínio é informação pública.

### `GET /auth/me`

Header `Authorization: Bearer <token>`. Devolve o mesmo objeto `usuario` do login. Usado para
revalidar a sessão hidratada do `localStorage` — sem isso, um token expirado só seria
detectado na primeira chamada de dado real.

---

## 5. Estado do backend

Entregue:

| Item | Onde |
| :-- | :-- |
| Migration `imobiliarias.subdominio` (`text not null unique` + check de formato) | `alembic/versions/003_add_subdominio_imobiliarias.py` |
| `POST /auth/login` e `GET /auth/me` | `app/api/v1/endpoints/auth.py` |
| `create_access_token` / `decode_access_token` | `app/core/security.py` |
| Dependency `get_current_user` (Bearer) | `app/api/deps.py` |
| Schemas com normalização de subdomínio e e-mail | `app/schemas/auth.py` |
| Subdomínios no seed (`nexios`, `horizonte`, `belavista`) | `app/db/seed.py` |
| CORS incluindo as portas de fallback do Vite (5174/5175) | `app/core/config.py` e `.env` |

O JWT carrega `sub`, `papel`, `imobiliaria_id`, `iat` e `exp`. O `imobiliaria_id` viaja no
token para que as queries dos próximos módulos consigam se escopar ao tenant sem uma ida
extra ao banco.

**Limitação conhecida:** `root` e `super_admin` têm `imobiliaria_id` nulo e portanto não
conseguem entrar por esta tela, que exige um subdomínio. O login de plataforma é escopo do
`nexios_imob_office`, não deste app.

### Camada mock

`VITE_USE_MOCK_AUTH=true` troca a implementação do `authService` por uma que valida em
memória contra as credenciais do seed, com ~600 ms de latência simulada. **Não é mais o
padrão** — serve para mexer na tela sem subir Postgres. A troca acontece no serviço; nenhum
componente, hook ou rota sabe qual implementação está ativa.

Credenciais aceitas pelo mock:

| Subdomínio | E-mail | Senha |
| :-- | :-- | :-- |
| `horizonte` | `gestor@horizonimoveis.com.br` | `GestorPassword123!` |
| `horizonte` | `corretor@horizonimoveis.com.br` | `CorretorPassword123!` |
| `nexios` | `gestor@nexiosimoveis.com.br` | `GestorPassword123!` |

---

## 6. Sessão

| Aspecto | Decisão |
| :-- | :-- |
| Storage | `localStorage`, chaves `nexios.token` e `nexios.usuario`. |
| Injeção | Interceptor de request do axios adiciona `Authorization: Bearer`. |
| Expiração | Interceptor de response: qualquer `401` limpa a sessão e manda para `/login`. |
| Hidratação | No boot, o `AuthProvider` lê o storage e popula o contexto de forma síncrona. |
| Logout | Limpa as duas chaves e navega para `/login`. |

`localStorage` foi escolhido por simplicidade e por sobreviver a refresh com o Vite rodando
separado do backend. A alternativa mais segura (access token em memória + refresh em cookie
`httpOnly`) exige `POST /auth/refresh` e CORS com credenciais — nada disso existe ainda. Fica
como evolução, e o isolamento em `services/session.ts` é justamente o que torna essa troca
barata: nenhum outro arquivo toca `localStorage` diretamente.

### Rotas

| Rota | Comportamento |
| :-- | :-- |
| `/login` | Se já autenticado, redireciona para `/dashboard`. |
| `/dashboard` | Protegida. Sem token → `/login`. |
| `/` | Redireciona para `/dashboard`. |
| `*` | Página 404. |

`/dashboard` nesta rodada é um placeholder (saudação + papel + botão Sair). A tela real é
trabalho de outro spec.

---

## 7. Critérios de aceite

- [ ] Em 1440px, a tela reproduz o mockup: split escuro/claro, logo, headline, três campos.
- [ ] Em 375px, o painel de marketing some e o form ocupa a largura com o logo no topo.
- [ ] O toggle inverte o tema do painel direito e a escolha sobrevive ao refresh.
- [ ] Submit vazio mostra os três erros de campo; e-mail malformado mostra o erro específico.
- [ ] `horizonte.nexiosimob.com.br` é aceito e enviado como `horizonte`.
- [ ] Credenciais válidas navegam para `/dashboard` com o nome do usuário na tela.
- [ ] Senha errada mostra o banner e **não** navega.
- [ ] `/dashboard` sem sessão redireciona para `/login`.
- [ ] Após login, F5 mantém o usuário em `/dashboard`.
- [ ] "Sair" volta para `/login` e limpa o `localStorage`.
- [ ] `npm run build` e `npm run lint` passam limpos.
- [ ] Todos os campos são alcançáveis por teclado, com labels associados e foco visível.

---

## 8. Convenções que o código precisa respeitar

Não são preferências de estilo — o build quebra sem elas.

- `verbatimModuleSyntax: true` → imports de tipo exigem `import type { … }`.
- `erasableSyntaxOnly: true` → sem `enum` e sem parameter properties; usar `as const` + união.
- `noUnusedLocals` / `noUnusedParameters` → nenhuma variável sobrando.
- Alias `@/` → `src/` (`vite.config.ts` + `tsconfig.app.json`). Nunca `../../..`.
- Prettier: aspas simples, ponto e vírgula, largura 100.
