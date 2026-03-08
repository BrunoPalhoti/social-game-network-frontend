# Social Game Network – Frontend

Frontend do Social Game Network em React, organizado com **Clean Architecture**.

## Onde colocar cada coisa

| O quê | Onde |
|-------|------|
| Rotas, providers | `app/` |
| Entidades, tipos, interfaces (ex.: `IAuthRepository`) | `core/domain`, `core/ports` |
| Lógica de aplicação (ex.: login, buscar jogos) | `core/useCases` |
| Chamadas HTTP, localStorage | `infrastructure/` |
| Componentes e páginas | `presentation/components`, `presentation/pages` |
| Tema, constantes, utils | `shared/` |

Para mais detalhes da arquitetura e regras de dependência, veja [`src/ARCHITECTURE.md`](src/ARCHITECTURE.md).

## Como rodar

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
