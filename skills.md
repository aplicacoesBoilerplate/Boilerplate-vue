# Boilerplate Vue Skills

Este arquivo documenta os padrões específicos do projeto Boilerplate-vue. As regras globais (válidas para todos os projetos) estão em `AGENTS.md`.

---

## Arquitetura de Componentes

### BaseForm — Refresh Nativo

`BaseForm.vue` usa `<script setup lang="ts" generic="T">` e expõe `IBaseFormExpose<T>`:

```ts
export interface IBaseFormExpose<TModel = unknown> {
  refreshForm: (criarObjetoModel: (pData?: TModel) => TModel) => Promise<void>;
  submit: () => void;
  isValid: () => boolean;
}
```

- `refreshForm` recebe uma factory function que retorna o estado limpo/restaurado do modelo.
- Formulários filhos devem expor `IForm<Nome>Expose` com `refreshForm()` e `submit()`.

### BaseDialog — Expose Tipado

`BaseDialog.vue` expõe `IBaseDialogExpose`:

```ts
export interface IBaseDialogExpose {
  abrir: () => void;
  fechar: () => void;
  cancelar: () => void;
  salvar: () => void;
}
```

Usar `defineExpose({...} satisfies IBaseDialogExpose)`.

### Dialog-Form Pattern

Cada dialog de formulário deve seguir este contrato:

```ts
export interface IDialogForm<Nome>Expose {
  exibicaoDialog: (pItem?: TNome) => void;
  concluirSalvo: () => void;
}
```

- `exibicaoDialog(pItem?)`: prepara dados e abre o dialog (modo edição se `pItem?.id` existe).
- `concluirSalvo()`: fecha o dialog e limpa formulário após salvamento bem-sucedido.
- `watch(exibirDialog)` dispara `handleRefresh()` ao fechar.
- O form é referenciado via `ref<IForm<Nome>Expose>`.

### Gráficos

- `BaseApexChart.vue` em `src/components/common/charts/BaseApexChart.vue`
- `ChartControls.vue` em `src/components/common/charts/ChartControls.vue`
- Dados: `TDadoGrafico = { rotulo: string; valor: number; agrupador?: string }`
- `gerarCores()` em `src/utils/generateColors.ts`

### GenericView — Gráficos Integrados

`GenericView.vue` suporta:

- Prop `exibirGraficos: boolean` — ativa coluna lateral de gráficos
- Prop `serviceExportacao` — método separado para exportação
- Slot `#data-chart` — conteúdo do gráfico
- `@toggle-chart` — emitido ao alternar visibilidade

### Filtros

- `IOpcaoSelecao` em `ICampoFiltro.ts`
- `CResolvePayloadFiltros` normaliza payloads
- `CBaseHttpService.resolverPayload()` método protegido
- `CConsultaGenericaService` para consultas paginadas genéricas
- `CFormatters` em `src/classes/Utils/CFormatters.ts`

### serviceFetch Signature

```ts
function nome(pPayload: IConsultaRegistrosFiltroPayload<string>) => Promise<IResultadoConsultaRegistrosFiltro<object> | object[]>;
```
