# Bateria de testes manuais — Tela de Login

Roteiro de aceite da Spec 001. Cobre frontend (`nexios_imob_client`) e backend
(`nexios-imob-backend`) rodando juntos.

---

## Preparação

**Terminal 1 — backend**

```bash
cd nexios-imob-backend
make migrate     # aplica a 003 (coluna subdominio)
make seed        # imobiliárias, usuários, imóveis de exemplo
make dev         # http://localhost:8000
```

**Terminal 2 — frontend**

```bash
cd nexios_imob_client
npm run dev -- --port 5173 --strictPort
```

`--strictPort` é proposital: sem ele o Vite cai para 5174 em silêncio e você acaba
testando numa origem diferente da que espera.

**Antes de começar**, confirme que os dois subiram:

```bash
curl -s http://localhost:8000/api/v1/health
# {"status":"ok",...,"database":"connected"}
```

Abra <http://localhost:5173> e o DevTools (aba Network + Console) — vários casos abaixo
dependem de ver a requisição.

### Credenciais do seed

| Imobiliária | E-mail | Senha | Papel |
| :-- | :-- | :-- | :-- |
| `horizonte` | `gestor@horizonimoveis.com.br` | `GestorPassword123!` | gestor |
| `horizonte` | `corretor@horizonimoveis.com.br` | `CorretorPassword123!` | corretor |
| `nexios` | `gestor@nexiosimoveis.com.br` | `GestorPassword123!` | gestor |
| `nexios` | `corretor1@nexiosimoveis.com.br` | `CorretorPassword123!` | corretor |
| `nexios` | `financeiro@nexiosimoveis.com.br` | `FinanceiroPassword123!` | financeiro |

---

## A. Visual

### A1 — Layout em tela larga
1. Janela em ~1440px de largura, acesse `/login`.
2. **Esperado:** duas colunas. Esquerda escura com logo no topo, headline "CRM imobiliário
   com inteligência artificial.", subcopy cinza, copyright no rodapé, e um brilho verde
   difuso no canto superior esquerdo. Direita clara com o formulário centralizado e o
   toggle no canto superior direito.

### A2 — Layout mobile
1. DevTools → modo dispositivo → 375px.
2. **Esperado:** a coluna escura some por completo. O formulário ocupa a largura, com o
   logo (em cor escura) acima do título "Entrar". Nenhuma barra de rolagem horizontal.

### A3 — Tema escuro
1. Clique no toggle no canto superior direito.
2. **Esperado:** o painel direito vira escuro; os campos, textos e bordas acompanham. O
   painel esquerdo não muda (já era escuro). O ícone do toggle vira lua.
3. Dê F5.
4. **Esperado:** continua escuro — a escolha persiste.
5. Clique de novo e recarregue: volta ao claro e permanece claro.

### A4 — Sem flash de tema
1. Com o tema escuro ativo, dê F5 algumas vezes.
2. **Esperado:** nenhum "piscar" branco antes da tela escura aparecer.

### A5 — Foco e teclado
1. Clique no campo Imobiliária, depois navegue só com `Tab`.
2. **Esperado:** a ordem é Imobiliária → E-mail → Senha → "Esqueci minha senha" → Entrar →
   "Fale com o time comercial". Todo elemento focado mostra um anel visível.
3. Com o foco no botão Entrar, aperte `Enter`.
4. **Esperado:** o formulário submete.

---

## B. Validação do formulário

### B1 — Campos vazios
1. Clique em Entrar sem preencher nada.
2. **Esperado:** três mensagens em vermelho — "Informe a imobiliária", "Informe o e-mail",
   "Informe a senha". **Nenhuma requisição** sai na aba Network.

### B2 — E-mail malformado
1. Preencha imobiliária e senha corretamente, e-mail como `gestor@`.
2. **Esperado:** "E-mail inválido". Nenhuma requisição.

### B3 — Senha curta
1. Senha com 7 caracteres (`1234567`).
2. **Esperado:** "A senha deve ter ao menos 8 caracteres". Nenhuma requisição.

### B4 — Subdomínio inválido
1. Imobiliária: `bela vista` (com espaço).
2. **Esperado:** "Subdomínio inválido". Nenhuma requisição.

### B5 — Erro some ao corrigir
1. Provoque o erro do B2 e depois corrija o e-mail para um válido.
2. **Esperado:** a mensagem desaparece assim que o campo fica válido, sem precisar
   submeter de novo.

---

## C. Autenticação

### C1 — Login válido (caminho feliz)
1. `horizonte` / `gestor@horizonimoveis.com.br` / `GestorPassword123!` → Entrar.
2. **Esperado durante:** o botão desabilita, aparece spinner e o texto vira "Entrando…".
3. **Esperado depois:** vai para `/dashboard` com "Olá, Lucas Mendes (Gestor Horizon)",
   perfil `gestor` em verde e o e-mail abaixo.
4. Na aba Network, o `POST /api/v1/auth/login` retornou **200** e o corpo traz
   `access_token`, `token_type: "bearer"` e `usuario`.

### C2 — Host completo no campo Imobiliária
1. Saia, e faça login usando `horizonte.nexiosimob.com.br` no campo Imobiliária.
2. **Esperado:** login normal. Na Network, o corpo enviado traz `"subdominio":"horizonte"` —
   o sufixo foi removido antes do envio.

### C3 — Senha errada
1. `horizonte` / `gestor@horizonimoveis.com.br` / `SenhaErrada123!`.
2. **Esperado:** banner vermelho "E-mail ou senha incorretos.". Continua em `/login`.
   Requisição com status **401**.

### C4 — Usuário que não existe
1. `horizonte` / `ninguem@horizonimoveis.com.br` / `GestorPassword123!`.
2. **Esperado:** exatamente a mesma mensagem do C3. É de propósito — mensagens diferentes
   permitiriam descobrir quais e-mails existem na imobiliária.

### C5 — Imobiliária que não existe
1. `naoexiste` / qualquer e-mail válido / qualquer senha de 8+ caracteres.
2. **Esperado:** banner "Imobiliária não encontrada.". Status **404**.

### C6 — Isolamento entre imobiliárias
1. `nexios` / `gestor@horizonimoveis.com.br` / `GestorPassword123!`.
   (usuário real, senha real, **imobiliária errada**)
2. **Esperado:** falha com "E-mail ou senha incorretos." (401). Um usuário não existe fora
   do seu tenant.

### C7 — Outra imobiliária funciona
1. `nexios` / `gestor@nexiosimoveis.com.br` / `GestorPassword123!`.
2. **Esperado:** entra, e o dashboard mostra "Carlos Eduardo (Gestor)".

### C8 — E-mail em caixa alta
1. `horizonte` / `GESTOR@HorizonImoveis.com.BR` / `GestorPassword123!`.
2. **Esperado:** entra normalmente.

---

## D. Sessão e rotas

### D1 — Sessão sobrevive ao refresh
1. Logado no dashboard, dê F5.
2. **Esperado:** continua no `/dashboard`, com o nome na tela. Não volta para o login.

### D2 — Rota protegida
1. Faça logout (ou abra uma janela anônima) e acesse `http://localhost:5173/dashboard`.
2. **Esperado:** redireciona para `/login`.

### D3 — Já logado não vê o login
1. Logado, digite `http://localhost:5173/login` na barra de endereço.
2. **Esperado:** redireciona direto para `/dashboard`.

### D4 — Raiz
1. Logado, acesse `http://localhost:5173/`.
2. **Esperado:** vai para `/dashboard`. Deslogado, vai parar em `/login`.

### D5 — Logout
1. No dashboard, clique em "Sair".
2. **Esperado:** volta para `/login`. Em DevTools → Application → Local Storage, as chaves
   `nexios.token` e `nexios.usuario` sumiram.

### D6 — 404
1. Acesse `http://localhost:5173/pagina-que-nao-existe`.
2. **Esperado:** página 404 com link "Voltar ao painel".

### D7 — Token adulterado expulsa a sessão
1. Logado, em DevTools → Application → Local Storage, edite `nexios.token` trocando alguns
   caracteres do final.
2. Dê F5 e clique em qualquer coisa que chame a API.
3. **Esperado:** a sessão cai e você volta para `/login`.
   *(Nesta rodada o dashboard é um placeholder e não chama a API sozinho — dá para forçar
   pelo Console: `fetch('http://localhost:8000/api/v1/auth/me',{headers:{Authorization:'Bearer '+JSON.parse(localStorage.getItem('nexios.token'))}})` — ou aceitar este caso como coberto pelos testes automatizados.)*

---

## E. Backend isolado (opcional, via terminal)

```bash
API=http://localhost:8000/api/v1

# 200 + token
curl -s -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"subdominio":"horizonte","email":"gestor@horizonimoveis.com.br","senha":"GestorPassword123!"}'

# 401
curl -s -o /dev/null -w '%{http_code}\n' -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"subdominio":"horizonte","email":"gestor@horizonimoveis.com.br","senha":"SenhaErrada1!"}'

# 404
curl -s -o /dev/null -w '%{http_code}\n' -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"subdominio":"naoexiste","email":"a@b.com","senha":"12345678"}'

# 401 sem token
curl -s -o /dev/null -w '%{http_code}\n' $API/auth/me
```

Documentação interativa: <http://localhost:8000/docs>.

### E1 — Suíte automatizada
```bash
cd nexios-imob-backend && make test
```
**Esperado:** `54 passed`. Não precisa de Postgres — a sessão de banco é substituída.

### E2 — Migration reversível
```bash
.venv/bin/alembic downgrade -1 && .venv/bin/alembic upgrade head
```
**Esperado:** desce e sobe sem erro. (Rode só se estiver disposto a mexer no banco local.)

---

## Checklist de aceite

| Bloco | Casos | OK? |
| :-- | :-- | :-- |
| A — Visual | A1 A2 A3 A4 A5 | ☐ |
| B — Validação | B1 B2 B3 B4 B5 | ☐ |
| C — Autenticação | C1 C2 C3 C4 C5 C6 C7 C8 | ☐ |
| D — Sessão e rotas | D1 D2 D3 D4 D5 D6 D7 | ☐ |
| E — Backend | E1 (+ curls, E2 opcional) | ☐ |

---

## Se algo falhar

| Sintoma | Causa provável |
| :-- | :-- |
| `Não foi possível conectar. Tente novamente.` | API fora do ar. Confira o terminal 1 e o `/health`. |
| Erro de CORS no Console | O Vite subiu numa porta fora da lista. Use `--strictPort` ou acrescente a origem em `BACKEND_CORS_ORIGINS` no `.env` do backend. |
| `Imobiliária não encontrada` com subdomínio certo | Seed não rodou depois da migration 003. Rode `make seed`. |
| Login some ao dar F5 | Local Storage bloqueado no navegador (modo restrito / extensão). |
| `column imobiliarias.subdominio does not exist` | Faltou `make migrate`. |
