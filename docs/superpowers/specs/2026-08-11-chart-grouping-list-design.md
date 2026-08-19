# Chart Grouping List Design

## Goal

Move chart grouping out of the standalone `v-select` and into the existing chart configuration menu opened by the `mdi-tune` button, without changing the chart's grouping model or visual result.

## Approved interaction

- The chart toolbar exposes only the configuration button.
- The configuration menu starts with an **Agrupar por** section.
- Every `opcoesFiltro` entry is rendered as a `v-list-item` with its existing icon and description.
- Clicking an entry writes its `valor` to `filtroSelecionado` and immediately refreshes the chart through the existing `v-model` flow.
- The current entry uses Vuetify's active state and an appended `mdi-check` icon.
- The menu remains open after a grouping change so the user can compare alternatives or change other chart controls.
- When there are no grouping options, the section and its divider are omitted.

## Architecture and compatibility

`ChartControls.vue` remains the sole owner of the grouping interaction. Its public contract (`opcoesFiltro` plus `v-model:filtroSelecionado`) remains unchanged, so `BaseApexChart.vue` and consuming views need no adaptation. The implementation uses Vuetify list/menu APIs and removes the migrated `v-select` completely.

## Accessibility and visual behavior

Each option keeps a readable title and leading semantic icon. Selection is communicated with both color/active styling and a check icon, avoiding color-only feedback. The existing menu positioning, theme integration, density, and rounded styling are retained.

## Verification

An E2E regression test must prove that the chart contains no combobox, that the grouping choices appear in the configuration menu, that clicking another choice changes the chart title and selected state, and that the menu remains visible. Lint, type checking, production build, and the full E2E suite complete the migration check.
