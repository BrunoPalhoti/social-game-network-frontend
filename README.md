# GamerVerse – Social Game Network (Frontend)

> **Resumo do projeto** — O que foi feito no front do **GamerVerse**:
>
> ✅ **Clean Architecture** — camadas definidas (core, presentation, infrastructure, shared)  
> ✅ **React 19 + TypeScript + Vite** — stack atual  
> ✅ **Autenticação** — login com Zustand + persistência de sessão  
> ✅ **Layout** — Header (busca, notificações, avatar) + Sidebar (Feed, Friends, Profile)  
> ✅ **Página de Perfil** — banner, avatar, badge PRO, abas (Jornada, Biblioteca, Conquistas, Amigos)  
> ✅ **UI** — PrimeReact + tema claro/escuro  
>
> Tudo pensado para escalar e manter o código organizado.

---

Frontend do **GamerVerse**, rede social para gamers, em React + TypeScript com **Clean Architecture**.

## Stack

- **React 19** + **TypeScript**
- **Vite**
- **PrimeReact** (UI)
- **Zustand** (estado + persistência)
- **React Router DOM**

## Funcionalidades

- Login com sessão persistida
- Layout com Header (busca, notificações, mensagens, avatar) e Sidebar (Feed, Friends, Profile)
- Página de Perfil com banner, avatar, badge PRO e abas (Jornada, Biblioteca, Conquistas, Amigos)
- Tema claro/escuro

## Como rodar

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Estrutura do projeto

| O quê | Onde |
|-------|------|
| Rotas, providers | `app/` |
| Entidades, tipos, interfaces | `core/domain`, `core/ports` |
| Lógica de aplicação | `core/useCases` |
| Chamadas HTTP, storage | `infrastructure/` |
| Componentes e páginas | `presentation/` |
| Tema, constantes, store | `shared/` |

Detalhes em [`src/ARCHITECTURE.md`](src/ARCHITECTURE.md).

---

## Acesso

**Tela ao vivo (Vercel):** [social-game-network-frontend.vercel.app](https://social-game-network-frontend.vercel.app) *(atualize com a URL do seu deploy)*

**Código (GitHub):** https://github.com/BrunoPalhoti/social-game-network-frontend

### Subir na Vercel

**Opção A – Pelo site (recomendado)**  
1. Acesse [vercel.com](https://vercel.com) e faça login (conta GitHub).  
2. **Add New** → **Project** → importe o repositório `social-game-network-frontend`.  
3. Deixe o **Framework Preset** como **Vite** e clique em **Deploy**.  
4. Copie a URL do deploy e atualize o link "Tela ao vivo" acima.

**Opção B – Pelo terminal**  
Na pasta do projeto, rode:

```bash
npx vercel
```

Na primeira vez vai pedir login; depois é só confirmar com Enter. No final aparece a URL (ex: `social-game-network-frontend-xxx.vercel.app`). Atualize o link no README.

O projeto já está com `vercel.json` configurado para o build e para as rotas do React Router funcionarem na produção.

### GitFlow: deploy automático na Vercel (main → produção)

Depois de conectar o repositório na Vercel (passos acima):

- **Branch de produção:** `main`
- **Cada push em `main`** → a Vercel faz o deploy automático e a tela ao vivo é atualizada.

Fluxo sugerido:
1. Desenvolver em branch (ex: `feature/nova-tela` ou `develop`).
2. Fazer merge ou push para `main` quando estiver pronto.
3. A Vercel detecta o push e faz o deploy sozinha.

Não é preciso rodar `vercel` no terminal depois de conectar o repo: **push em main = deploy na Vercel**.
