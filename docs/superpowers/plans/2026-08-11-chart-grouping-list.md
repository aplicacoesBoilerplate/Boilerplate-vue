# Chart Grouping List Implementation Plan

> **For Codex:** Execute this plan with test-driven development and verify every command before reporting completion.

**Goal:** Replace the chart grouping `v-select` with grouping `v-list-item` entries inside the existing chart configuration menu while preserving the existing `v-model` data flow and chart result.

**Architecture:** Keep the change localized to `ChartControls.vue`. The component will continue receiving `opcoesFiltro` and exposing `filtroSelecionado`; only the interaction surface changes. Locale files provide the new section heading, and Playwright verifies the full consumer flow in `UsuariosView`.

**Tech Stack:** Vue 3, TypeScript, Vuetify, vue-i18n, Playwright.

---

### Task 1: Specify the behavior with a failing E2E test

**Files:**
- Modify: `tests/e2e/generic-view-action-drawer.spec.ts`

- [ ] Add a focused test that opens the users chart and its `mdi-tune` menu.
- [ ] Assert that the chart toolbar no longer contains a combobox.
- [ ] Assert that the menu exposes the grouping section and known options.
- [ ] Select a different grouping and assert the title, active state, check icon, and persistent open menu.
- [ ] Run the focused test and confirm it fails for the current standalone `v-select` implementation.

### Task 2: Centralize grouping in the chart configuration menu

**Files:**
- Modify: `src/components/common/charts/ChartControls.vue`
- Modify: `src/locales/pt.json`
- Modify: `src/locales/en.json`
- Modify: `src/locales/es.json`

- [ ] Remove the complete `v-select` block.
- [ ] Add an `Agrupar por` list section before visualization options.
- [ ] Bind active state to `filtroSelecionado`, write the chosen value on click, and append `mdi-check` to the selected item.
- [ ] Guard the section for an empty `opcoesFiltro` array.
- [ ] Replace the obsolete select-label translation with the grouping section translation in all supported locales.

### Task 3: Verify behavior and migration compatibility

**Files:**
- Verify: `src/components/common/charts/ChartControls.vue`
- Verify: `tests/e2e/generic-view-action-drawer.spec.ts`

- [ ] Run the focused grouping E2E test and confirm it passes.
- [ ] Run ESLint with zero warnings.
- [ ] Run TypeScript checking and the production build.
- [ ] Run the full Playwright suite.
- [ ] Inspect the focused diff and run `git diff --check` before completion.
