# ESLint Zero Problems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar todos os erros e avisos reportados pelo ESLint no frontend Vue sem alterar o comportamento da aplicação.

**Architecture:** Usar o relatório atual como teste vermelho, aplicar somente o autofix oficial e corrigir manualmente cada família restante. Validar cada bloco com lint direcionado e concluir com lint estrito, type-check, testes E2E e build.

**Tech Stack:** Vue 3.5, TypeScript 5.8, Vuetify 4, ESLint 9 flat config, typescript-eslint 8, eslint-plugin-vue 10, Playwright e Vite 6.

## Global Constraints

- Preservar todas as alterações locais preexistentes e não reverter arquivos do usuário.
- Não desabilitar regras, reduzir severidade ou adicionar supressões.
- Corrigir também avisos; o critério final é `npm run lint -- --max-warnings 0` com exit code 0.
- Manter contratos públicos e comportamento; atualizar todos os consumidores de símbolos renomeados.
- Não criar commit, push ou PR sem solicitação explícita.

## Baseline

- `npm run lint -- --format json`: 96 erros e 91 avisos em 40 arquivos.
- Regras dominantes: 91 `@typescript-eslint/naming-convention`, 31 `jsdoc/require-description`, 18 `jsdoc/require-param-description`, 16 `no-explicit-any` e 11 `jsdoc/require-returns`.

---

### Task 1: Correções automáticas seguras

**Files:**
- Modify: `src/components/common/informacoes/versoes/ListaRealizadosVersoes.vue`
- Modify: `src/components/forms/core/fixtures/filtros/inputValorFiltro/InputValorFiltroRange.vue`
- Modify: `src/components/forms/core/FormFiltros.vue`

**Interfaces:** Consome a flat config atual e produz templates equivalentes formatados segundo `vue/first-attribute-linebreak`.

- [x] **Step 1: Confirmar o autofix sem gravar**

```powershell
npm run lint -- --fix-dry-run --format json
```

Expected: as três ocorrências incluem fix e nenhuma alteração é gravada.

- [x] **Step 2: Aplicar o autofix e validar**

```powershell
npm run lint:fix
npm run lint -- --format json
```

Expected: zero `vue/first-attribute-linebreak`; ocorrências manuais permanecem.

### Task 2: Nomenclatura TypeScript

**Files:**
- Modify: `src/components/forms/fixtures/{DateTimePicker,InputDebouncer,InputTextUpperCase,InputUpperCase}.vue`
- Modify: `src/components/layouts/base/appbar/fixtures/{BtnActionDrawer,BtnAlterLanguage}.vue`
- Modify: `src/components/layouts/base/{BaseDataTable,Breadcrumbs}.vue`
- Modify: `src/components/layouts/GridDataChart.vue`
- Modify: `src/composables/{useChartHelpers,useInfiniteList}.ts`
- Modify: `src/plugins/index.ts`
- Modify: `src/stores/{genericFilter.store,listaCache.store,Snackbar.store}.ts`
- Modify: `src/utils/{ManagerStorage,NavigationRouteBuilder,RouteScrollRestore}.ts`
- Modify: importadores de classes/interfaces renomeadas encontrados com `rg`.

**Interfaces:** Consome prefixos `p`, `I` e `C` definidos no ESLint e produz os mesmos valores, assinaturas e efeitos com todas as referências atualizadas.

- [x] **Step 1: Renomear parâmetros locais e seus usos**

```typescript
(value) => expression
// torna-se
(pValue) => expression
```

Expected: nenhuma assinatura muda além do nome local do parâmetro.

- [x] **Step 2: Corrigir interfaces/classes e consumidores**

```typescript
interface Props {} // torna-se interface IProps {}
class ClassManagerStorage {} // torna-se class CManagerStorage {}
```

Expected: imports, exports e usos são atualizados globalmente, sem aliases paliativos.

- [x] **Step 3: Validar**

```powershell
npm run lint -- --format json
```

Expected: zero `@typescript-eslint/naming-convention`.

### Task 3: Templates e props Vue

**Files:**
- Modify: `src/components/forms/core/fixtures/rbac/ControlePermissoesCargo.vue`
- Modify: `src/components/forms/fixtures/DateTimePicker.vue`
- Modify: `src/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue`
- Modify: `src/components/layouts/base/BaseDataTable.vue`
- Modify: `src/views/DashboardView.vue`

**Interfaces:** Consome eventos camelCase e props opcionais; produz templates válidos e defaults semanticamente neutros.

- [x] **Step 1: Corrigir eventos e shadowing**

```vue
@update:modelValue="handler"
```

Expected: substitui `@update:model-value`; alias de slot não sombreia `props` do script.

- [x] **Step 2: Declarar defaults opcionais neutros**

```typescript
const props = withDefaults(defineProps<IProps>(), {
  top: undefined,
  right: undefined,
  left: undefined,
  onLoad: undefined,
});
```

Expected: zero `vue/require-default-prop` sem alterar valores efetivos.

- [x] **Step 3: Adicionar filho vazio à raiz de Dashboard e validar**

```vue
<template><div /></template>
```

```powershell
npm run lint -- --format json
```

Expected: zero ocorrências das regras Vue do baseline.

### Task 4: Tipos seguros e código usado

**Files:**
- Modify: `src/components/forms/core/fixtures/rbac/ControlePermissoesCargo.vue`
- Modify: `src/components/forms/fixtures/autenticacao/{EtapaCodigoRecuperacaoSenha,EtapaEmailRecuperacaoSenha,EtapaSenhaRecuperacaoSenha,PainelLogin,PainelRegistro}.vue`
- Modify: `src/components/layouts/base/appbar/AppBar.vue`
- Modify: `src/components/layouts/base/BaseDataTable.vue`
- Modify: `src/components/layouts/generic/fixtures/MenuExportacaoDados.vue`
- Modify: `src/components/layouts/GridDataChart.vue`
- Modify: `src/composables/{useChartHelpers,useControlePermissoesCargo,useInfiniteList}.ts`
- Modify: `src/models/components/props/IPropsBaseDataTable.ts`
- Modify: `src/stores/{listaCache.store,Snackbar.store}.ts`

**Interfaces:** Consome tipos reais do projeto e produz callbacks/dados tipados com `unknown`, genéricos ou interfaces concretas, sem `Function`/`any`.

- [x] **Step 1: Remover bindings e imports não usados**

```typescript
defineProps<IProps>();
```

Expected: substitui `const props = ...` somente quando `props` não é lido.

- [x] **Step 2: Substituir tipos inseguros e explicitar catch**

```typescript
type TFetchData<TItem> = (pOffset: number, pLimit: number) => Promise<TItem[]>;
catch { return; }
```

Expected: tipos refletem o fluxo real e o tratamento silencioso existente fica explícito.

- [x] **Step 3: Validar lint e tipos**

```powershell
npm run lint -- --format json
npm run type-check
```

Expected: zero `no-explicit-any`, `no-unused-vars`, `no-unsafe-function-type` e `no-empty`; type-check com exit 0.

### Task 5: JSDoc completo

**Files:**
- Modify: `src/components/layouts/base/appbar/fixtures/BtnInstalarPwa.vue`
- Modify: `src/components/layouts/base/navigation/NavigationDrawer.vue`
- Modify: `src/composables/{useHealthCheck,useOpcoesSelecaoFiltro,useOperadoresFiltro,useSincronizacaoPermissoesRbac,useThemeSwitch}.ts`
- Modify: `src/stores/{genericFilter.store,Snackbar.store}.ts`
- Modify: `src/utils/{NavigationRouteBuilder,RouteScrollRestore}.ts`
- Modify: `src/views/InformacoesSistemaView.vue`

**Interfaces:** Consome comportamento/tipos reais e produz documentação verdadeira para descrição, parâmetros e retorno.

- [x] **Step 1: Completar os contratos JSDoc individualmente**

```typescript
/**
 * @description Descreve o comportamento observável da função.
 * @param pValue Descreve o significado do argumento.
 * @returns Descreve o valor retornado.
 */
```

Expected: textos adaptados a cada função, sem documentação genérica enganosa.

- [x] **Step 2: Validar**

```powershell
npm run lint -- --format json
```

Expected: zero ocorrências `jsdoc/*`.

### Task 6: Verificação integral

**Files:** Verify all modified application files.

**Interfaces:** Consome o código corrigido e produz evidência fresca de lint, tipagem, E2E e build.

- [x] **Step 1: Executar a suíte final**

```powershell
npm run lint -- --max-warnings 0
npm run type-check
npm run test:e2e
npm run build
git diff --check
```

Expected: todos os comandos com exit code 0, lint com zero erros/avisos e testes Playwright passando.

- [x] **Step 2: Revisar o escopo**

```powershell
git status --short
git diff --stat
```

Expected: nenhuma alteração fora do escopo atribuível a esta tarefa.
