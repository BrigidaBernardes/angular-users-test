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

## Por que Signals em vez de NgRx?

O enunciado permite NgRx **ou** Signals. Para o escopo desta tela (uma única
feature), optei por Signals por ser a abordagem mais moderna recomendada
atualmente pelo time do Angular, com menos boilerplate e sem dependências
extras — o que deixa o código mais enxuto e fácil de revisar. O estado fica
centralizado em `UsuarioStore`
(`src/app/core/services/usuario-store.service.ts`), que expõe signals
somente-leitura para os componentes e concentra os efeitos colaterais (busca
com debounce, criação, edição). A implementação completa de NgRx (actions,
reducer, selectors, effect) pedida na seção 3.2 do desafio está no documento
respondido, para demonstrar o conhecimento do padrão também.

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

## Funcionalidades implementadas

- [x] Listagem de usuários (nome, e-mail, botão editar), reproduzindo o layout do protótipo
- [x] Filtro por nome com debounce de 300ms
- [x] Estado de loading e mensagem de erro com botão "tentar novamente"
- [x] Dados mockados em `UsuarioService` (array estático em memória, simulando latência de rede)
- [x] Modal de cadastro aberto pelo botão vermelho (FAB, `color="warn"`)
- [x] Formulário reativo: e-mail, nome, cpf, telefone e tipo de telefone (todos obrigatórios)
- [x] Mensagens de erro por campo
- [x] Botão salvar desabilitado enquanto o formulário for inválido
- [x] Preenchimento automático do formulário em modo edição
- [x] Componentes standalone
- [x] Subscriptions gerenciadas com `takeUntilDestroyed` (busca no filtro e salvamento no modal)
- [x] Pelo menos 2 operadores RxJS além de map/tap: `debounceTime`, `switchMap`, `catchError`
- [x] Cobertura de testes acima de 60% (Jest)

### Diferenciais implementados

- [x] Paginação client-side na listagem (aparece quando há mais usuários do que o tamanho de página)
- [x] Validação de formato: e-mail (`Validators.email`), CPF (dígito verificador completo), telefone (formato brasileiro)
- [x] Pequenas melhorias sobre o protótipo: botão de fechar (X) no modal, mensagens de estado vazio, notificação (snackbar) de sucesso ao salvar

### Diferencial não implementado

- [ ] **Nx Monorepo** — optei por um projeto Angular CLI único em vez de dividir em
  bibliotecas (`feature-users`, `data-access-users`, `ui`). Para o tamanho desta
  feature, um monorepo Nx adicionaria complexidade de configuração sem ganho real,
  e priorizei ter uma base 100% funcional e bem testada. Ver "Possíveis evoluções"
  abaixo.

## Como testar manualmente o estado de erro

Como os dados são mockados, para ver a mensagem de erro na listagem:

1. Abra `src/app/core/services/usuario.service.ts`
2. Troque `private forcarErro = false;` para `true`
3. Salve e recarregue a aplicação

## Possíveis evoluções futuras

- Migrar para um Nx Monorepo com bibliotecas separadas por camada
- Máscara de input para CPF e telefone durante a digitação (ex: `ngx-mask`)
- Persistir os dados mockados em `localStorage` para simular persistência entre recargas
- Testes E2E com Playwright ou Cypress
- Tela de navegação real por trás do ícone de menu no topo (hoje é só visual, como no protótipo)
