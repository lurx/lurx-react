# SonarQube Issues Fix Plan

## Overview

- **16 Reliability issues** (bugs)
- **86 Maintainability issues** (code smells)
- Total unique issues: **86** (the 16 reliability issues are a subset)

---

## Phase 1: Quick Mechanical Fixes (60 issues)

### 1.1 `window`/`global` → `globalThis` (S7764) — 16 occurrences

Replace `window` and `global` with `globalThis` for consistency.

| File | Lines |
| --- | --- |
| `jest.setup.ts` | 26, 47, 52, 59 |
| `accessibility-widget.test.tsx` | 668, 669, 695 |
| `accessibility-widget-helpers.test.ts` | 74, 89, 95, 115 |
| `accessibility-widget.component.tsx` | — (no, different rule) |
| `resizable-drawer.test.tsx` | 19, 240 |
| `entry-animation.component.tsx` | 13 |
| `entry-animation.context.tsx` | 25 |
| `use-hero-entry-animation.hook.ts` | 11 |

### 1.2 `[arr.length - N]` → `.at(-N)` (S7755) — 8 occurrences

| File | Lines |
| --- | --- |
| `accessibility-widget.test.tsx` | 238, 373, 636, 660 |
| `about-editor-helpers.test.ts` | 54, 55 |
| `toggle-in-array.test.ts` | 35 |
| `handle-input.system.ts` | 11 |

### 1.3 `.getAttribute('data-*')` → `.dataset` / `.setAttribute('data-*')` → `.dataset` (S7761) — 4 occurrences

| File | Lines |
| --- | --- |
| `typewrite.test.ts` | 72, 78, 84 |
| `typewrite.util.ts` | 14 |

### 1.4 `Array()` → `new Array()` (S7723) — 4 occurrences

| File | Lines |
| --- | --- |
| `wolverine-arm.component.tsx` (rotem-is-a-dev) | 5, 6 |
| `wolverine-arm.component.tsx` (wolverine-css) | 5, 6 |

### 1.5 `String#replace()` → `String#replaceAll()` (S7781) — 1 occurrence

| File | Lines |
| --- | --- |
| `to-code-like.util.ts` | 9 |

### 1.6 `String.raw` for escaped strings (S7780) — 3 occurrences

| File | Lines |
| --- | --- |
| `jest.config.ts` (rotem-is-a-dev) | 28, 29 |
| `eslint.config.cjs` | 17 |

### 1.7 `Math.sqrt()` → `Math.hypot()` (S7769) — 1 occurrence

| File | Lines |
| --- | --- |
| `rge-pacman-game.helpers.ts` | 82 |

### 1.8 Optional chaining (S6582) — 1 occurrence

| File | Lines |
| --- | --- |
| `raw-loader.cjs` | 4 |

### 1.9 `node:path` over `path` (S7772) — 1 occurrence

| File | Lines |
| --- | --- |
| `next.config.js` | 93 |

### 1.10 Unused imports (S1128) — 2 occurrences

| File | Lines |
| --- | --- |
| `rge-pacman-game.component.tsx` | 21 (`GHOST_NAMES`) |
| `social-bar.component.tsx` | 3 (`SocialLink`) |

### 1.11 Useless assignments (S1854) — 3 occurrences

| File | Lines |
| --- | --- |
| `resizable-drawer.test.tsx` | 168 (`container`), 169 (`titleElements`) |
| `wolverine-demo.test.tsx` | 53 (`sniktElements`) |

### 1.12 Unused prop in mock (S6767) — 1 occurrence

| File | Lines |
| --- | --- |
| `sign-in-dialog.test.tsx` | 18 (`className`) |

### 1.13 Unnecessary type assertion (S4325) — 1 occurrence

| File | Lines |
| --- | --- |
| `file-tree-section.test.tsx` | 74 |

### 1.14 Object literal as default param (S7737) — 1 occurrence

| File | Lines |
| --- | --- |
| `use-shiki-tokens.test.ts` | 20 |

### 1.15 Read-only props (S6759) — 2 occurrences

| File | Lines |
| --- | --- |
| `blog/[slug]/page.tsx` | 33 |
| `wolverine-css/layout.tsx` | 8-12 |

### 1.16 Commented-out code (S125) — 5 occurrences

| File | Lines |
| --- | --- |
| `button.module.scss` | 22, 23 |
| `wolverine.module.scss` | 37 |
| `wolverine-css/page.module.scss` | 37 |
| `playwright.config.ts` | 13 |

### 1.17 Async arrow function should be named (S7726) — 1 occurrence

| File | Lines |
| --- | --- |
| `jest.config.ts` (root) | 3 |

### 1.18 `useState` not destructured (S6754) — 1 occurrence

| File | Lines |
| --- | --- |
| `accessibility-widget.component.tsx` | 30 |

---

## Phase 2: Accessibility & Semantic HTML (12 issues)

### 2.1 Use native `<dialog>` instead of `role="dialog"` (S6819) — 2 occurrences

| File | Lines |
| --- | --- |
| `resizable-drawer.component.tsx` | 123-131 |
| `accessibility-widget.component.tsx` | 149-153 |

### 2.2 Use native elements instead of ARIA roles (S6819) — 3 occurrences

| File | Lines |
| --- | --- |
| `technology-filter.component.tsx` | 41-45 (`role="group"` → `<fieldset>`) |
| `blue-blur.component.tsx` | 2-10 (`role="presentation"` → `<img alt="">`) |
| `green-blur.component.tsx` | 2-10 (`role="presentation"` → `<img alt="">`) |

### 2.3 Non-interactive elements with handlers need keyboard support (S6848 + S1082) — 7 occurrences

| File | Lines |
| --- | --- |
| `hero-snippets.component.tsx` | 44-51 |
| `rge-pacman-game.test.tsx` | 6-16 |
| `rge-brickfall-game.test.tsx` | 6-13 |
| `rge-snake-game.test.tsx` | 6-17 |

---

## Phase 3: Structural Refactors (5 issues)

### 3.1 Nested template literals (S4624) — 2 occurrences

| File | Lines |
| --- | --- |
| `hero-game.component.tsx` | 84 |
| `arrow-key-grid.component.tsx` | 52 |

### 3.2 Array index as key (S6479) — 6 occurrences

| File | Lines |
| --- | --- |
| `demo-carousel.component.tsx` | 32, 61 |
| `wolverine-arm.component.tsx` (rotem-is-a-dev) | 12, 23 |
| `wolverine-arm.component.tsx` (wolverine-css) | 12, 23 |

### 3.3 Provide compare function for `.sort()` (S2871) — 1 occurrence (CRITICAL)

| File | Lines |
| --- | --- |
| `blog-page.helpers.ts` | 12 |

### 3.4 Reduce cognitive complexity (S3776) — 1 occurrence (CRITICAL)

| File | Lines |
| --- | --- |
| `update-mode.system.ts` | 8 (complexity 21, max 15) |

---

## Phase 4: CSS Issues in wolverine-css (10 issues)

These are in the `wolverine-css` app and the wolverine demo SCSS:

- Duplicate CSS properties (`bottom`) — 2 occurrences
- Duplicate selectors — 6 occurrences
- Commented-out CSS code — 2 occurrences (counted in Phase 1)
- Empty CSS blocks — 2 occurrences
- Color contrast — 2 occurrences

---

## Execution Order

1. **Phase 1** first — mechanical, low-risk, high-count fixes
2. **Phase 3.3** — critical `.sort()` bug
3. **Phase 2** — accessibility fixes
4. **Phase 3** — remaining structural refactors
5. **Phase 4** — CSS cleanup (wolverine app)

Each phase gets its own commit.
