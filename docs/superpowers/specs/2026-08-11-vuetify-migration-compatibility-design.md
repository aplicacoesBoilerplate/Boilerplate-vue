# Vuetify Migration Compatibility Design

## Goal

Restore the migrated Vuetify 4 application to a stable, visually equivalent state, with no application console errors in the covered flows and with user-specific chart preferences persisted by resource.

## Approved architecture

The work is divided into four independently verifiable slices:

1. **Runtime and overlay stability:** install one Pinia instance before the router, eliminate recursive filter updates, keep drawer-owned overlays mounted from `BtnActionDrawer`, fix the licence dialog, and make the full-screen overlay theme aware.
2. **Charts and preferences:** normalize radial-bar values while retaining raw counts for labels and tooltips, stop tooltip clipping, and persist visibility, grouping, chart type, legend, and labels through the existing `/preferencias/me` preference service with local cache fallback.
3. **RBAC and icon selection:** show matching unlinked users during RBAC search and provide a one-click link action; retain the new icon selector as the only editable icon field and redesign its cards with a centered larger icon and a title footer.
4. **i18n and visual consistency:** move remaining user-facing Portuguese strings into the locale catalogs, make filter/table metadata resolve translations reactively, and guarantee readable semantic button text in both themes.

## Compatibility principles

- `BtnActionDrawer` owns the mount lifetime and forced-open state of every action it contains; child dialogs do not duplicate hover logic.
- The backend preference is authoritative per authenticated user. Local storage remains a fast cache and fallback, namespaced through the existing preference store.
- Chart preferences are keyed by a stable resource context such as `usuarios`; stale grouping values are validated against the resource's current grouping options.
- Radial-bar series use percentages in the 0–100 range required for correct rendering, while custom formatters expose the original counts.
- Tooltips must remain visible at chart boundaries without leaking behind dialogs or other overlays.
- Static route translation keys remain keys. Runtime labels, table headers, filter fields, empty states, notifications, buttons, and tooltips are resolved through `vue-i18n`.
- Existing user changes in the dirty worktree are preserved. No automatic commit is made.

## Acceptance criteria

- The licence action opens, remains open when the pointer leaves the drawer, and closes without Vue/Vuetify errors.
- Numeric filters can be opened and edited without recursive-update, setup, watcher, or slot warnings originating from application code.
- The users radial chart renders visible arcs and correct labels/raw values.
- Every chart preference survives reload and is loaded from the authenticated preference endpoint for the same resource.
- Chart tooltips remain fully visible near every edge and above chart layers.
- Dark-theme save buttons meet WCAG AA text contrast; light and dark overlays remain translucent and readable.
- Searching in the RBAC linked-users panel returns matching unlinked users and a one-click action links them to the open role.
- All editable icon fields use `SeletorIconeMaterialDesign`; icon cards have a centered large icon and a separate footer title.
- Portuguese, English, and Spanish catalogs have structural parity, no invalid lookup is emitted, and audited UI flows contain no hardcoded Portuguese copy.
- Type-check, lint, production build, and the full Playwright suite pass with no application console errors or warnings in the critical flows.
