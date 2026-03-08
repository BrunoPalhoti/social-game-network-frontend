# Arquitetura do Projeto (Clean Architecture)

Estrutura do frontend organizada em camadas para facilitar manutenção, testes e evolução.

## Estrutura de pastas

```
src/
├── app/                    # Configuração da aplicação
│   └── App.jsx             # Rotas e composição principal
├── core/                   # Núcleo – regras de negócio
│   ├── domain/             # Entidades, tipos, DTOs
│   ├── useCases/           # Casos de uso (lógica de aplicação)
│   └── ports/              # Interfaces (contratos para repositórios, serviços)
├── infrastructure/         # Implementações externas
│   ├── http/               # Cliente HTTP, API (futuro)
│   └── storage/            # LocalStorage, sessão (futuro)
├── presentation/           # Camada de apresentação (UI)
│   ├── components/         # Componentes reutilizáveis
│   │   └── ThemeToggle/
│   └── pages/              # Páginas (views)
│       ├── Home/
│       └── Login/
├── shared/                 # Recursos compartilhados
│   └── theme/              # Tema, variáveis CSS, ThemeContext
├── main.jsx                # Entry point
└── ARCHITECTURE.md         # Este arquivo
```

## Regras de dependência

- **core** não depende de nada dentro de `src/` (apenas de libs).
- **presentation** pode usar `core`, `shared` e `infrastructure`.
- **app** orquestra rotas e providers; importa de `presentation` e `shared`.
- **infrastructure** implementa os contratos definidos em `core/ports`.

## Onde colocar cada coisa

| Conteúdo | Pasta |
|----------|--------|
| Rotas, providers, setup do app | `app/` |
| Entidades, tipos, interfaces de repositório | `core/domain`, `core/ports` |
| Lógica de negócio (ex: login, buscar jogos) | `core/useCases` |
| Chamadas HTTP, localStorage, cookies | `infrastructure/` |
| Componentes UI, páginas, hooks de UI | `presentation/` |
| Tema, constantes, utils genéricos | `shared/` |

## Exemplo de fluxo (futuro)

1. **core/ports**: `IAuthRepository` (interface).
2. **core/useCases**: `LoginUseCase` chama `IAuthRepository.login()`.
3. **infrastructure**: `AuthApiRepository` implementa `IAuthRepository` e chama a API.
4. **presentation/pages/Login**: usa `LoginUseCase` (injetado ou via contexto) e renderiza o formulário.

Com isso, a UI não conhece HTTP nem detalhes da API; apenas o caso de uso e o contrato em `core`.
