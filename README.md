# Gestão de Usuários — Teste Técnico Angular

## Stack utilizada

- Angular 17 (componentes standalone, novo control flow `@if`/`@for`)
- Angular Material 17
- Signals (`signal`, `computed`, `effect`) para gerenciamento de estado
- RxJS (`debounceTime`, `switchMap`, `catchError`, `map`, `tap`)
- Jest + jest-preset-angular para testes unitários
- SCSS

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
