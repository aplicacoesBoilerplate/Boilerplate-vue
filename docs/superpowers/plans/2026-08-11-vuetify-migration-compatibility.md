# Vuetify Migration Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Vuetify 4 migration stable and visually compatible across charts, overlays/dialogs, RBAC links, icon selection, themes, preferences, i18n, and console behavior.

**Architecture:** Deliver four testable slices behind existing public component contracts. Centralize action-overlay lifetime in `BtnActionDrawer`, use a singleton Pinia plus the existing preference API, keep charts responsible only for rendering, and resolve all visible copy at render time through `vue-i18n`.

**Tech Stack:** Vue 3.5, Vuetify 4.1.8, Pinia 3, vue-i18n 11, ApexCharts 5.15, TypeScript 5.8, Vite 6, Playwright 1.62.

## Global Constraints

- Preserve all unrelated changes in the dirty worktree.
- Do not commit automatically.
- Use failing behavior tests before production edits.
- Treat `/preferencias/me` as the authoritative per-user persistence mechanism and local storage as fallback/cache.
- Keep action content and overlay lifetime centralized in `BtnActionDrawer`.
- Finish only after all eleven reported requirements have current evidence.

---

### Task 1: Runtime, filter, licence dialog, and overlay stability

**Files:**
- Modify: `tests/e2e/generic-view-action-drawer.spec.ts`
- Modify: `tests/e2e/support/mockAuthenticatedApi.ts`
- Modify: `src/plugins/index.ts`
- Modify: `src/services/base/axios.ts`
- Modify: `src/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue`
- Modify: `src/components/dialogs/core/DialogLicence.vue`
- Modify: `src/components/forms/base/BaseForm.vue`
- Modify: `src/components/forms/core/fixtures/filtros/SelectOperadorFiltro.vue`
- Modify: `src/components/forms/core/fixtures/filtros/inputValorFiltro/InputValorFiltroDefault.vue`
- Modify: `src/components/common/OverlayFullscream.vue`

**Interfaces:**
- Produces: exported singleton `pinia`; stable action-slot lifetime; direct `v-model:isValid` form contract; theme-aware overlay scrim.
- Consumes: existing `drawerKeepOpen` injection contract and existing route/filter models.

- [ ] **Step 1: Write failing E2E regressions**

Add tests that open the licence dialog, leave the drawer, close it, open the filter dialog, select a numeric field, edit its value, and assert the captured console warning/error list is empty. Add a light-theme overlay assertion that its computed scrim alpha is below `1`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium --grep "licença|filtro numérico|overlay"
```

Expected: failures reproduce dialog unmounting, recursive/filter console output, or opaque light scrim.

- [ ] **Step 3: Implement the minimum stable contracts**

Create and export one `pinia = createPinia()` from `src/plugins/index.ts`, install it before the router, and pass it explicitly to stores used outside component setup. Keep the drawer slot mounted and toggle its presentation without destroying teleported overlays. Replace the BaseForm validity watcher with a model that forwards the value directly. Keep validation rule arrays referentially stable and correct the filter translation key. Configure overlay `scrim`, `opacity`, and content colors from the active Vuetify theme.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the command from Step 2 and require a clean console capture.

---

### Task 2: Radial charts, tooltip stacking, and per-resource user preferences

**Files:**
- Modify: `tests/e2e/generic-view-action-drawer.spec.ts`
- Modify: `tests/e2e/support/mockAuthenticatedApi.ts`
- Modify: `src/stores/preferences.store.ts`
- Create: `src/composables/useChartPreferences.ts`
- Modify: `src/components/common/charts/BaseApexChart.vue`
- Modify: `src/components/common/charts/ChartControls.vue`
- Modify: `src/components/layouts/GridDataChart.vue`
- Modify: `src/views/administrativo/filhos/UsuariosView.vue`

**Interfaces:**
- Produces: `IChartPreferences` with `visible`, `grouping`, `type`, `showLegend`, and `showLabels`; `useChartPreferences(context, options, defaults)`.
- Consumes: preference store backend/local synchronization and `TChartType`.

- [ ] **Step 1: Write failing chart behavior tests**

Add E2E tests that expose the users chart, assert a radial arc path is rendered, change grouping/type/legend/labels/visibility, reload, and assert the same state is restored. Capture preference writes and return the stored value from the mock. Add a viewport-edge hover assertion proving the Apex tooltip bounding box remains inside the viewport and above chart layers.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium --grep "radial|preferências do gráfico|tooltip"
```

Expected: radial arc, restored controls, or tooltip-bound assertions fail before implementation.

- [ ] **Step 3: Implement chart state and rendering**

Extend the preference store with a record keyed by resource. Normalize radial series to percentages, always provide Apex labels, retain a raw-value lookup for label/tooltip formatters, and show a raw total. Remove `overflow-hidden` from the chart content path, set a fixed responsive tooltip position, and establish a chart-local z-index. Bind the users view and chart controls to the composable's computed state.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the command from Step 2 and require all state restoration and geometry assertions to pass.

---

### Task 3: RBAC user lookup and icon selector visual contract

**Files:**
- Modify: `tests/e2e/generic-view-action-drawer.spec.ts`
- Modify: `tests/e2e/support/mockAuthenticatedApi.ts`
- Modify: `src/components/forms/core/fixtures/rbac/UsuariosVinculadosCargo.vue`
- Modify: `src/views/administrativo/filhos/RbacView.vue`
- Modify: `src/components/forms/fixtures/SeletorIcone/GradeIconesMaterialDesign.vue`
- Verify: `src/components/forms/core/FormCargoRbac.vue`

**Interfaces:**
- Produces: search results containing linked and unlinked users; `onVincularUsuario` event or equivalent one-click mutation for the open role.
- Consumes: existing role selection model and `SeletorIconeMaterialDesign`.

- [ ] **Step 1: Write failing RBAC and icon-card tests**

Add an unlinked user to the mock. Search that user in the open role dialog, assert the result appears, click the link action, and assert the role model changes. Open the icon selector and assert the icon body is centered, at least `56px`, and the title occupies a distinct bottom footer.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium --grep "usuário não vinculado|cartão de ícone"
```

Expected: the unlinked user is absent and the footer geometry assertion fails.

- [ ] **Step 3: Implement the minimum interaction and layout**

When search is empty, retain the linked-user view. When search contains text, include all matching users and render a one-click link action for users outside the open role while preserving `SelectRole`. Restructure each icon card into a flex-growing centered body and a full-width footer with ellipsis; use a `64px` icon. Confirm no other editable form field binds an icon string outside `SeletorIconeMaterialDesign`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the command from Step 2 and require both interaction and geometry assertions to pass.

---

### Task 4: Reactive i18n, theme contrast, and complete verification

**Files:**
- Modify: `src/locales/pt.json`
- Modify: `src/locales/en.json`
- Modify: `src/locales/es.json`
- Modify: user-facing Vue/components/models identified by the static audit
- Modify: `src/plugins/vuetify.ts`
- Modify: `src/components/dialogs/base/BaseDialog.vue`
- Modify: `tests/e2e/generic-view-action-drawer.spec.ts`
- Modify: `tests/e2e/authentication-compatibility.spec.ts`

**Interfaces:**
- Produces: structurally identical locale catalogs, render-time translated model metadata, explicit semantic `on-*` colors, AA save-button contrast.
- Consumes: `useI18n()`/global i18n translator and existing locale keys.

- [ ] **Step 1: Write failing locale and contrast tests**

Add E2E coverage that switches among pt-BR/en/es on filters, dialogs, RBAC, charts, and public pages and rejects missing-key console output. Add a dark-theme save-button contrast calculation requiring `>= 4.5`. Add a locale catalog parity test through the existing Node/Vite test path or a Playwright `page.evaluate` import boundary.

- [ ] **Step 2: Run tests and verify RED**

Run the focused i18n/contrast Playwright tests and confirm the current invalid key/static-copy/contrast assertions fail.

- [ ] **Step 3: Implement translations and semantic colors**

Add matching keys to all three catalogs, replace static visible copy with `t(...)`, and make field/operator/table descriptors carry translation keys resolved at render time instead of module-load Portuguese strings. Define explicit `on-primary`, `on-success`, `on-error`, and related semantic colors for both themes and ensure save buttons use the matching `on-*` color.

- [ ] **Step 4: Run complete verification**

Run:

```powershell
npm run type-check
npm run lint
npm run build-only
npm run test:e2e -- --project=chromium
git diff --check
```

Expected: all commands exit `0`, the full E2E suite captures no application warnings/errors, locale catalogs have parity, and every acceptance criterion in the design document has a passing assertion or direct audit evidence.
