# GamerVerse – Especificação de UX, Dados e API

**Projeto:** Rede social para gamers – listas, avaliações e comunidade  
**Versão:** 1.0  
**Data:** Março 2026  

---

## 1. Visão geral do produto

O GamerVerse é uma plataforma para gamers organizarem listas de jogos, darem notas, acompanharem a jornada anual (zerados, desejados, dropados) e interagirem em um feed e com amigos. O documento descreve a UX do protótipo, as entradas de dados e os endpoints de API necessários para o backend.

---

## 2. O que um Feed Gamer pode ter

Com base nos mockups e na ideia de comunidade, o feed pode incluir:

| Elemento | Descrição |
|----------|-----------|
| **Postagens de análise** | Texto + capas de jogos + nota (ex.: ★ 9.2) + status (Zerado / Quero jogar / Dropado). |
| **Status do jogo na postagem** | Selos: ✔ 100% Zerado, [Zerei], [Quero Jogar], [Dropei] com motivo (ex.: "Repetitivo após 10h"). |
| **Botão RATE** | Permitir que outros usuários deem sua própria nota ao jogo. |
| **Interações** | Curtir, comentar, compartilhar (com contadores). |
| **Atividades** | Ex.: "@DarthGamer acabou de platinar 'Hades II'!" com ação [DAR PARABÉNS]. |
| **Destaques/Stories** | Linha de avatares (amigos ou perfis em destaque) no topo do feed. |
| **Chat lateral** | Conversas recentemente ativas e busca de usuário para iniciar chat. |

---

## 3. Modelo de nota para o jogo

- **Formato:** Nota numérica (ex.: 9.2) e/ou estrelas (1–5 ★).
- **Onde aparece:** Na postagem (análise), no card do jogo no perfil (Jornada/Biblioteca) e na comparação entre amigos.
- **Regras sugeridas:** Escala 1–10 ou 1–5 estrelas; uma nota por usuário por jogo (atualizável).
- **Comparação entre amigos:** Bloco "Diferença de notas" (ex.: Starfield @Bruno ★9.5 vs @Darth ★7.0).

---

## 4. Kanban / Painel de Jornada (por ano)

Conceito: “painel de jornada” por ano (ex.: 2026) com abas que funcionam como listas/kanban:

| Aba / Campo | Descrição | Entradas de dados |
|-------------|-----------|-------------------|
| **Zerados (N)** | Jogos completados naquele ano. | Jogo, data de conclusão, horas jogadas, nota, opcional “100% / platina”. |
| **Desejados (N)** | Lista de desejos (wishlist). | Jogo, data de adição. Opcional: prioridade. |
| **Dropados (N)** | Jogos abandonados + motivo. | Jogo, motivo (texto livre ou tags), horas jogadas antes de dropar, nota opcional. |
| **Ranking (Top 5)** | Ranking de atividade entre amigos. | Pontuação (ex.: “Profilbos”) calculada por zerados, horas, interações, etc. |

No perfil, a **Súmula de Jogos** do ano mostra cada jogo com: capa, status (✔ Zerado / 🗑 Dropado), horas, nota (★), campo “Notes” e “Ver Detalhes”.

---

## 5. Fluxos de UX principais (para o protótipo)

1. **Login / Criar conta** → Home (Feed).  
2. **Feed:** ver postagens, criar análise (jogo + nota + status), curtir/comentar, RATE.  
3. **Perfil:** abas Jornada 2026, Biblioteca, Conquistas, Amigos; editar lista (zerados/desejados/dropados) e motivo de drop.  
4. **Amigos:** lista de amigos, jogos em comum, diferença de notas, ranking de atividade.  
5. **Discover:** descobrir jogos (busca, filtros).  
6. **Chat:** conversas ativas, buscar usuário, enviar mensagem.  

---

## 6. Mapeamento de entradas de dados

### 6.1 Autenticação

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| username | string | Sim | Nome de usuário (login). |
| password | string | Sim | Senha (hash no backend). |
| email | string | Sim (registro) | Para criar conta e recuperação de senha. |

### 6.2 Usuário / Perfil

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| username | string | Sim | Único. |
| displayName | string | Não | Nome exibido. |
| avatarUrl | string (URL) | Não | Foto de perfil. |
| bio | string | Não | Biografia. |
| tag | string | Não | Ex.: "Augtx Gamer". |

### 6.3 Jogo (catálogo / biblioteca da plataforma)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| id | string (UUID) | Sim | ID do jogo na plataforma. |
| name | string | Sim | Nome do jogo. |
| coverImageUrl | string (URL) | Não | Capa. |
| releaseYear | number | Não | Ano de lançamento. |
| genres | string[] | Não | Gêneros. |
| platform | string[] | Não | Plataformas. |

*(Jogos podem vir de API externa, ex. IGDB/RAWG, e serem normalizados nesses campos.)*

### 6.4 Relação usuário–jogo (status na lista / jornada)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| userId | string | Sim | ID do usuário. |
| gameId | string | Sim | ID do jogo. |
| status | enum | Sim | `WISHLIST` \| `PLAYING` \| `COMPLETED` \| `DROPPED` \| `PLATINUM`. |
| year | number | Condicional | Ano da jornada (ex.: 2026); relevante para zerados/dropados no ano. |
| completedAt | datetime | Se COMPLETED | Data de conclusão. |
| hoursPlayed | number | Não | Horas jogadas. |
| rating | number | Não | Nota (ex.: 1–10 ou 1–5). |
| droppedReason | string | Se DROPPED | Motivo do drop (texto livre). |
| notes | string | Não | Notas pessoais do usuário. |

### 6.5 Postagem (feed)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| authorId | string | Sim | ID do usuário. |
| content | string | Sim | Texto da postagem/análise. |
| gameIds | string[] | Não | Jogos citados (capas exibidas). |
| primaryGameId | string | Não | Jogo principal da análise (ex.: Elden Ring). |
| rating | number | Não | Nota dada ao jogo na análise. |
| status | enum | Não | Zerado / Quero jogar / Dropado (para exibir selo). |
| droppedReason | string | Não | Se status = Dropado. |
| createdAt | datetime | Sim | Data/hora da postagem. |

### 6.6 Interações na postagem

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| postId | string | Sim | ID da postagem. |
| userId | string | Sim | Quem interagiu. |
| type | enum | Sim | `LIKE` \| `COMMENT` \| (compartilhar pode ser evento ou tipo). |
| commentText | string | Se COMMENT | Texto do comentário. |
| createdAt | datetime | Sim | Data/hora. |

### 6.7 Avaliação “RATE” (nota do usuário no jogo a partir do feed)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| userId | string | Sim | Quem deu a nota. |
| gameId | string | Sim | Jogo avaliado. |
| rating | number | Sim | Nota (ex.: 1–10). |
| postId | string | Não | Se a nota foi dada a partir de uma postagem. |
| createdAt | datetime | Sim | Data/hora. |

*(Pode ser a mesma entidade “relação usuário–jogo” com campo `rating`.)*

### 6.8 Amizade

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| userId | string | Sim | Um usuário. |
| friendId | string | Sim | Outro usuário. |
| status | enum | Sim | `PENDING` \| `ACCEPTED` \| `BLOCKED`. |
| createdAt | datetime | Sim | Data/hora. |

### 6.9 Mensagem (chat)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| senderId | string | Sim | Remetente. |
| receiverId | string | Sim | Destinatário. |
| conversationId | string | Sim | Agrupa mensagens da conversa. |
| content | string | Sim | Texto. |
| createdAt | datetime | Sim | Data/hora. |

### 6.10 Conquistas (opcional para MVP)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| userId | string | Sim | Usuário. |
| achievementKey | string | Sim | Ex.: "PLATINUM_HADES_II". |
| gameId | string | Não | Jogo relacionado. |
| unlockedAt | datetime | Sim | Data/hora. |

### 6.11 Ranking / pontuação de atividade

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| userId | string | Sim | Usuário. |
| period | string | Sim | Ex.: "2026" (ano). |
| score | number | Sim | Pontos (ex.: Profilbos). |
| computedFrom | object | Não | Zerados, horas, likes recebidos, etc. |

*(Pode ser calculado no backend a partir de jogos zerados, horas, interações.)*

---

## 7. Endpoints da API sugeridos

Base URL sugerida: `https://api.gamerverse.example.com/v1` (ou equivalente).

### 7.1 Autenticação

| Método | Endpoint | Descrição | Body (ex.) |
|--------|----------|-----------|------------|
| POST | `/auth/register` | Criar conta | `{ "username", "email", "password" }` |
| POST | `/auth/login` | Login | `{ "username", "password" }` |
| POST | `/auth/logout` | Logout | - |
| POST | `/auth/refresh` | Renovar token | - |
| POST | `/auth/forgot-password` | Esqueci a senha | `{ "email" }` |

### 7.2 Usuário

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/users/me` | Perfil do usuário logado | - |
| PATCH | `/users/me` | Atualizar perfil | `{ "displayName", "avatarUrl", "bio", "tag" }` |
| GET | `/users/:username` | Perfil público por username | - |
| GET | `/users/search` | Buscar usuários | `?q=termo` |

### 7.3 Jogos (catálogo)

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/games` | Listar/buscar jogos | `?q=elden&genre=action&limit=20&offset=0` |
| GET | `/games/:id` | Detalhes de um jogo | - |

### 7.4 Lista do usuário (jornada / kanban)

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/users/me/games` | Minha lista (todos os status) | `?status=COMPLETED&year=2026` |
| GET | `/users/me/journey/:year` | Resumo da jornada do ano | Ex.: `/users/me/journey/2026` → zerados, desejados, dropados, totais. |
| POST | `/users/me/games` | Adicionar jogo à lista | `{ "gameId", "status", "rating?", "hoursPlayed?", "droppedReason?", "notes?" }` |
| PATCH | `/users/me/games/:gameId` | Atualizar status/nota/motivo | `{ "status", "rating", "hoursPlayed", "droppedReason", "completedAt", "notes" }` |
| DELETE | `/users/me/games/:gameId` | Remover da lista | - |
| GET | `/users/:userId/games` | Lista de outro usuário (público) | `?status=COMPLETED&year=2026` |

### 7.5 Feed

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/feed` | Postagens do feed | `?limit=20&offset=0` (e eventualmente `?friendsOnly=true`) |
| POST | `/feed/posts` | Criar postagem | `{ "content", "gameIds?", "primaryGameId?", "rating?", "status?", "droppedReason?" }` |
| GET | `/feed/posts/:id` | Detalhes de uma postagem | - |
| PATCH | `/feed/posts/:id` | Editar postagem (autor) | Mesmos campos do POST. |
| DELETE | `/feed/posts/:id` | Excluir postagem (autor) | - |
| POST | `/feed/posts/:id/like` | Curtir | - |
| DELETE | `/feed/posts/:id/like` | Descurtir | - |
| GET | `/feed/posts/:id/comments` | Comentários | `?limit=20&offset=0` |
| POST | `/feed/posts/:id/comments` | Comentar | `{ "content" }` |
| POST | `/feed/posts/:id/rate` | Dar nota ao jogo (RATE) | `{ "gameId", "rating" }` |

### 7.6 Amigos e comparação

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/users/me/friends` | Lista de amigos | `?status=ACCEPTED` |
| POST | `/users/me/friends` | Enviar solicitação | `{ "friendId" }` ou `{ "username" }` |
| PATCH | `/users/me/friends/:userId` | Aceitar/rejeitar | `{ "status": "ACCEPTED" \| "REJECTED" }` |
| DELETE | `/users/me/friends/:userId` | Remover amigo | - |
| GET | `/users/me/friends/:friendId/common-games` | Jogos em comum | `?year=2026` |
| GET | `/users/me/friends/rating-differences` | Diferença de notas entre amigos | `?friendId=...&limit=10` |
| GET | `/users/me/friends/activity-ranking` | Ranking de atividade (ex.: Top 5) | `?period=2026` |

### 7.7 Chat

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/conversations` | Conversas recentes | - |
| GET | `/conversations/:id/messages` | Mensagens da conversa | `?limit=50&before=timestamp` |
| POST | `/conversations` | Iniciar conversa | `{ "receiverId" }` |
| POST | `/conversations/:id/messages` | Enviar mensagem | `{ "content" }` |
| (WebSocket) | `/ws/conversations/:id` | Tempo real (opcional) | - |

### 7.8 Conquistas (opcional)

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/users/me/achievements` | Minhas conquistas | - |
| GET | `/users/:userId/achievements` | Conquistas de outro usuário | - |

### 7.9 Notificações (opcional)

| Método | Endpoint | Descrição | Body / Query |
|--------|----------|-----------|--------------|
| GET | `/notifications` | Listar notificações | `?unreadOnly=true&limit=20` |
| PATCH | `/notifications/:id/read` | Marcar como lida | - |

---

## 8. Resumo de entidades e relações

- **User** → tem muitos **UserGame** (lista/jornada), muitas **Post**, muitas **Friend** (amizades), muitas **Rating** (notas em jogos).
- **Game** → referenciado em **UserGame**, **Post**, **Rating**.
- **Post** → pertence a **User**; tem muitos **Like**, **Comment**; pode referenciar **Game** e nota.
- **Conversation** → tem muitas **Message**; liga **User** (sender/receiver).

---

## 9. Próximos passos sugeridos

1. Validar esta especificação com o backend (e ajustar nomes de campos se necessário).  
2. Implementar primeiro: auth, usuário, jogos (busca), lista do usuário (CRUD + jornada por ano).  
3. Em seguida: feed (postagens + likes + comentários + RATE).  
4. Depois: amigos, jogos em comum, diferença de notas, ranking.  
5. Por último: chat e conquistas.  
6. Manter protótipo de UI alinhado às abas Zerados / Desejados / Dropados e ao modelo de nota (estrelas/número) em todo o app.  

---

*Documento gerado para o projeto GamerVerse – uso interno e alinhamento frontend/backend.*
