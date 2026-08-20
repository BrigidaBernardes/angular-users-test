# Gestão de Usuários — Teste Técnico Angular (Seção 4)

Aplicação Angular para listagem, cadastro e edição de usuários, reproduzindo o
protótipo fornecido no desafio técnico.

## Stack utilizada

- Angular 17 (componentes standalone, novo control flow `@if`/`@for`)
- Angular Material 17
- Signals (`signal`, `computed`, `effect`) para gerenciamento de estado
- RxJS (`debounceTime`, `switchMap`, `catchError`, `map`, `tap`)
- Jest + jest-preset-angular para testes unitários
- SCSS

## Pré-requisitos

- Node.js 18.13+ ou 20.9+ (recomendado usar a versão LTS mais recente)
- npm 9+

## Instalação

```bash
npm install
```

## Executar em modo desenvolvimento

```bash
npm start
```

A aplicação sobe em `http://localhost:4200`.

## Rodar os testes

```bash
npm test
```

Para ver o relatório de cobertura:

```bash
npm run test:coverage
```

O relatório HTML fica em `coverage/index.html`.

## Build de produção

```bash
npm run build
```

## Estrutura do projeto

```
src/app/
├── core/
│   ├── models/          # Usuario, NovoUsuario, TipoTelefone
│   ├── services/         # UsuarioService (dados mockados) e UsuarioStore (estado com signals)
│   └── validators/       # Validadores customizados de CPF (dígito verificador) e telefone
└── features/users/
    ├── user-list/         # Tela de listagem: toolbar, busca, estados, paginação, FAB
    ├── user-card/         # Linha individual do usuário na listagem
    └── user-form-modal/   # Modal de cadastro/edição
```
