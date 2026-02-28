# File Structure Analysis: rotem-is-a-dev

> Audit of `apps/rotem-is-a-dev/src/` against the conventions defined in CLAUDE.md.

---

## Directory Tree

```
src/
├── @types/                              # Global ambient type declarations
│   ├── cv.d.ts
│   ├── error-page.d.ts
│   ├── generics.d.ts
│   └── shiki.d.ts
├── __mocks__/
│   └── raw-file.js
├── types/
│   └── raw.d.ts
├── styles/                              # Global SCSS
│   ├── _variables.scss
│   └── mixins/
│       ├── _media.scss
│       ├── _normalize-to-grid.scss
│       └── _spacing.scss
├── snippets/                            # Code snippet utilities (100% tested)
│   ├── chunk.snippet.ts
│   ├── debounce.snippet.ts
│   ├── deep-clone.snippet.ts
│   ├── flatten.snippet.ts
│   ├── group-by.snippet.ts
│   ├── memoize.snippet.ts
│   ├── throttle.snippet.ts
│   └── __tests__/ (7 matching tests)
├── ascii-art/
│   ├── error.ascii.ts
│   ├── no-posts.ascii.ts
│   ├── not-found.ascii.ts
│   └── index.ts
├── hooks/
│   ├── index.ts
│   ├── use-on-click-outside/            # .hook.ts, .types.ts, __tests__, index.ts
│   └── use-responsive/                  # .hook.ts, __tests__, index.ts
├── lib/
│   └── shiki/                           # .types.ts, .hook.ts, __tests__, index.ts
├── data/
│   └── cv.ts
├── demos/
│   ├── index.ts
│   ├── demo-carousel/                   # .component.tsx, .module.scss, index.ts
│   ├── demo-container/                  # .component.tsx, .types.ts, .module.scss, index.ts
│   ├── sheep/                           # .demo.tsx, .module.scss, index.ts
│   └── wolverine/                       # .demo.tsx, .types.ts, .module.scss, index.ts, components/
│
├── app/
│   ├── layout.tsx                       # Root layout
│   ├── error.tsx                        # Root error boundary
│   │
│   ├── components/                      # Shared UI components
│   │   ├── index.ts
│   │   ├── __tests__/barrel-exports.test.ts
│   │   ├── ascii-art-renderer/          # .component, .types, .module.scss, index
│   │   ├── code-block/                  # code-block + server-code-block, .types, .module.scss, __tests__, index
│   │   ├── error-page/                  # error-page + error-page-button, .types, .module.scss, index
│   │   ├── fa-icon/                     # .component, .types, __tests__, index
│   │   ├── filter-panel/               # .component, .types, .module.scss, __tests__, index
│   │   ├── flex/                        # .component, .types, .module.scss, __tests__, index
│   │   ├── link/                        # .component, .types, .module.scss, __tests__, index
│   │   ├── loaders/
│   │   │   ├── index.ts
│   │   │   ├── animated-loader/         # .component, .types, __tests__, index
│   │   │   └── simple-loader/           # .component, .module.scss, __tests__, index
│   │   ├── logo/                        # .component, .types, .constants, __tests__, index
│   │   ├── resizable-drawer/            # .component + drawer-header, .types, .module.scss, __tests__, index
│   │   ├── shiki-code/                  # .component, .types, __tests__
│   │   ├── status-page/                 # .component, .types, .module.scss, __tests__, index
│   │   ├── technology-filter/           # .component + tech-checkbox-item, .types, .module.scss, __tests__, index
│   │   └── text-input/                  # .component, .types, .module.scss, __tests__, index
│   │
│   ├── utils/
│   │   ├── to-code-like.util.ts         # + .types.ts, __tests__
│   │   └── typewrite.util.ts            # + .types.ts
│   │
│   ├── content/posts/                   # Blog markdown content
│   │   ├── clean-jsx.md
│   │   └── react-component-structure.md
│   │
│   ├── error-test-root/                 # Error boundary test page
│   │   ├── page.tsx
│   │   └── error-test.module.scss
│   │
│   ├── layout/
│   │   ├── index.ts
│   │   ├── navbar/
│   │   │   ├── navbar.component.tsx     # + .types.ts, .module.scss, __tests__
│   │   │   ├── nav-items.constants.ts   # + nav-items.types.ts, __tests__
│   │   │   └── components/
│   │   │       ├── contact-button.component.tsx          # __tests__
│   │   │       ├── download-cv-button.component.tsx      # __tests__
│   │   │       ├── nav-item.component.tsx                # __tests__
│   │   │       ├── nav-items-list.component.tsx           # __tests__
│   │   │       ├── navbar-logo.component.tsx             # + .types.ts
│   │   │       └── mobile-menu/
│   │   │           ├── mobile-menu.component.tsx         # + .module.scss, __tests__
│   │   │           └── mobile-nav-item.component.tsx     # + .types.ts
│   │   ├── social-bar/
│   │   │   ├── social-bar.component.tsx  # + .types.ts, .constants.ts, .module.scss, __tests__
│   │   │   └── components/
│   │   │       ├── social-icon.component.tsx
│   │   │       ├── social-link.component.tsx       # + .types.ts, __tests__
│   │   │       └── social-links-list.component.tsx # + .types.ts
│   │   └── accessibility-widget/
│   │       ├── accessibility-widget.component.tsx  # + .types.ts, .module.scss, __tests__, index
│   │
│   ├── cv/
│   │   ├── page.tsx, layout.tsx, error.tsx
│   │   ├── page.module.scss
│   │   ├── __tests__/error.test.tsx
│   │   ├── styles/global.scss
│   │   ├── context/cv.context.tsx
│   │   ├── utils/
│   │   │   ├── generate-pdf.ts
│   │   │   └── render-cv-offscreen.tsx  # + .types.ts
│   │   ├── error-test/                  # page.tsx, .module.scss
│   │   ├── components/
│   │   │   ├── button/                  # .component, .types, .module.scss, index
│   │   │   ├── card/                    # .component, .types, .module.scss, index
│   │   │   └── download-pdf-button/     # .component, index
│   │   └── sections/
│   │       ├── index.ts
│   │       ├── contact/                 # .component, .module.scss, index
│   │       ├── experience/              # experience + experience-item, .module.scss, index
│   │       ├── header/                  # .component, index
│   │       ├── intro/                   # .component, .module.scss, index
│   │       ├── languages/               # .component, .module.scss, index
│   │       └── skills/                  # .component, .module.scss, index
│   │
│   └── (main)/
│       ├── page.tsx, layout.tsx, loading.tsx, not-found.tsx, error.tsx
│       │
│       ├── components/
│       │   ├── entry-animation/
│       │   │   ├── entry-animation.component.tsx  # + .types.ts, .module.scss, .context.tsx, index
│       │   │   ├── border-lines.component.tsx     # + .module.scss
│       │   │   └── replay-button.component.tsx    # + .module.scss
│       │   ├── hero-section/
│       │   │   ├── hero-section.component.tsx     # + .module.scss, .strings.ts, index
│       │   │   ├── hero.context.tsx               # + hero.types.ts
│       │   │   ├── hero-entry-animation.component.tsx
│       │   │   ├── hero-game.component.tsx
│       │   │   ├── use-hero-entry-animation.hook.ts
│       │   │   ├── __tests__/ (hero-context, hero-section, hero-snippets)
│       │   │   ├── blurs/
│       │   │   │   ├── blue-blur.component.tsx
│       │   │   │   └── green-blur.component.tsx
│       │   │   └── components/
│       │   │       ├── github-link.component.tsx         # __tests__
│       │   │       ├── hero-blurs.component.tsx
│       │   │       ├── hero-introduction.component.tsx   # __tests__
│       │   │       ├── role-line.component.tsx
│       │   │       └── hero-snippets/
│       │   │           ├── hero-snippets.component.tsx   # + .constants, .herlpers, .module.scss
│       │   │           └── hero-snippet-slide.component.tsx  # + .types.ts
│       │   ├── mobile-page-title/
│       │   │   ├── mobile-page-title.component.tsx  # + .types.ts, .module.scss, __tests__, index
│       │   └── snake-game/
│       │       ├── snake-game.component.tsx  # + .types.ts, .module.scss, index
│       │       ├── hooks/use-snake-game.hook.ts
│       │       ├── __tests__/ (snake-game, snake-game-won, use-snake-game)
│       │       └── components/
│       │           ├── game-controls.component.tsx       # + .types.ts, __tests__
│       │           ├── game-instructions.component.tsx   # __tests__
│       │           └── arrow-keys/
│       │               ├── arrow-keys.component.tsx      # + .constants, __tests__
│       │               └── arrow-key.component.tsx       # + .types.ts, __tests__
│       │
│       ├── about-me/
│       │   ├── page.tsx
│       │   ├── about-page.component.tsx  # + .module.scss
│       │   ├── __tests__/about-page.test.tsx
│       │   ├── data/
│       │   │   └── about-files.data.ts   # + .types.ts, __tests__
│       │   └── components/
│       │       ├── index.ts
│       │       ├── about-content/        # .component, .types, index (NEW - untracked)
│       │       ├── about-editor/         # .component, .module.scss, __tests__, index
│       │       ├── file-tree/
│       │       │   ├── file-tree.component.tsx  # + .module.scss, __tests__, index
│       │       │   └── components/
│       │       │       ├── index.ts
│       │       │       ├── file-item/    # .component, .types, index
│       │       │       └── file-tree-section/  # .component, .types, index
│       │       ├── gist-panel/
│       │       │   ├── gist-panel.component.tsx  # + .module.scss, __tests__, index
│       │       │   └── components/gist/  # .component, .types, index
│       │       ├── sidebar/              # .component, .types, .module.scss, __tests__, index
│       │       ├── sidebar-button/       # .component, .types, .module.scss, index
│       │       └── tab-bar/              # tab-bar + tab + tab-context-menu, .types each, .module.scss each, __tests__, index
│       │
│       ├── blog/
│       │   ├── page.tsx
│       │   ├── blog-page.component.tsx   # + .types.ts, .helpers.ts, .module.scss
│       │   ├── components/
│       │   │   ├── index.ts
│       │   │   ├── blog-post-card.component.tsx  # + .types.ts
│       │   │   ├── no-posts.component.tsx
│       │   │   └── blog-tags/
│       │   │       ├── index.ts
│       │   │       ├── blog-tag.component.tsx
│       │   │       └── blog-tags-list.component.tsx
│       │   └── [slug]/
│       │       ├── page.tsx
│       │       ├── blog-post-page.types.ts
│       │       ├── blog-post.module.scss
│       │       └── components/
│       │           ├── index.ts
│       │           ├── back-to-blog-link.component.tsx
│       │           └── blog-post-header.component.tsx
│       │
│       └── projects/
│           ├── page.tsx
│           ├── data/
│           │   └── projects.data.tsx     # + .types.ts
│           └── components/
│               ├── demo-renderer/        # .component, .types, (no index)
│               ├── project-card/         # .component, .types, .module.scss, __tests__, index
│               ├── project-demo-drawer/  # .component, .types, .module.scss, __tests__, index
│               ├── projects-grid/        # .component, .types, .module.scss, index
│               └── projects-page/        # .component, .module.scss, index
```

---

## Findings

### 1. Filename Typo ✅ Fixed

| File | Issue |
|------|-------|
| ~~`hero-section/components/hero-snippets/hero-snippets.herlpers.ts`~~ | Renamed to `hero-snippets.helpers.ts` |

### 2. Naming Convention Violations ✅ Fixed

| File | Issue |
|------|-------|
| ~~`app/components/technology-filter/technology.filter.constants.ts`~~ | Renamed to `technology-filter.constants.ts` |

### 3. Missing `index.ts` Barrel Exports ✅ Fixed

All 7 directories now have barrel exports. All `@/app/components` imports consolidated through the top-level barrel.

### 4. Missing `.types.ts` Files ✅ Fixed

Most components originally listed here turned out to be propless (no props = no types file needed) or already had types in shared files (e.g. `navbar.types.ts`, `blog-page.types.ts`, ambient `cv.d.ts`).

**5 components actually had inline type definitions — all fixed:**
- `layout/navbar/components/contact-button.component.tsx` → created `contact-button.types.ts`
- `layout/social-bar/components/social-icon.component.tsx` → created `social-icon.types.ts`
- `cv/sections/skills/skills.component.tsx` (SkillTag) → created `skills.types.ts`
- `cv/sections/experience/experience-item.component.tsx` → created `experience-item.types.ts`
- `(main)/about-me/components/about-editor/about-editor.component.tsx` → created `about-editor.types.ts`

### 5. Missing `__tests__/` Directories

Components/areas entirely lacking test coverage:

**Entire CV module (0 tests for 10 components):**
- All 6 sections, experience-item, card, button, download-pdf-button

**Blog components:**
- blog-page, blog-post-card, blog-tag, blog-tags-list, no-posts, back-to-blog-link, blog-post-header

**Projects components:**
- projects-grid, projects-page, demo-renderer

**About-me sub-components:**
- about-content (new), sidebar-button, file-item, file-tree-section, gist

**Hero section sub-components:**
- hero-entry-animation, hero-game, border-lines, replay-button, hero-blurs, role-line, blue-blur, green-blur, hero-snippet-slide

**Other:**
- ascii-art-renderer, error-page, error-page-button, animated-loader (styles), status-page types
- `typewrite.util.ts` - no tests (while `to-code-like.util.ts` has tests)
- social-icon, social-links-list, navbar-logo, mobile-nav-item

### 6. Structural Inconsistencies

| Pattern | Where it's correct | Where it's inconsistent |
|---------|-------------------|------------------------|
| Context + types file | `entry-animation.context.tsx` + `entry-animation.types.ts`, `hero.context.tsx` + `hero.types.ts` | `cv.context.tsx` uses global ambient type (works but is inconsistent with other contexts) |
| Hook inside own folder | `hooks/use-on-click-outside/`, `hooks/use-responsive/` | `snake-game/hooks/use-snake-game.hook.ts` (in a `hooks/` subfolder, no own folder), `hero-section/use-hero-entry-animation.hook.ts` (loose at component root) |
| Shared component location | `app/components/` = truly shared | `app/(main)/components/` = shared within main route group (fine, but no barrel) |
| Data file suffix | `about-files.data.ts`, `projects.data.tsx` | `cv.ts` (no `.data.ts` suffix) |
| Helper file suffix | `blog-page.helpers.ts` | `hero-snippets.herlpers.ts` (typo aside, uses plural `.herlpers` vs singular `.helpers`) |
| Tests at folder root | Most tests in `component/__tests__/` | `app/components/__tests__/barrel-exports.test.ts` sits at the shared components root (acceptable for barrel test) |

### 7. Well-Organized Areas

These areas fully follow conventions and can serve as reference implementations:

- **`src/snippets/`** - 7 snippets, 7 tests, clean `.snippet.ts` suffix, 100% coverage
- **`src/hooks/`** - Proper folder structure with `.hook.ts`, `.types.ts`, `__tests__/`, `index.ts`
- **`src/lib/shiki/`** - Shared `.types.ts`, hook, tests, barrel export
- **`app/components/flex/`** - `.component.tsx`, `.types.ts`, `.module.scss`, `__tests__/`, `index.ts`
- **`app/components/filter-panel/`** - Same complete structure
- **`app/components/text-input/`** - Same complete structure
- **`(main)/about-me/components/tab-bar/`** - Multiple components, all with individual `.types.ts`
- **`(main)/components/snake-game/`** - Deep nesting done right with proper `.types.ts` per component

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Filename typo | 1 (fixed) | High (broken references possible) |
| Naming convention violations | 1 (fixed) | Medium |
| Missing `index.ts` barrels | 7 (fixed) | Low |
| Missing `.types.ts` files | 5 (fixed) | Medium |
| Missing `__tests__/` | ~40+ components | High (vs 100% coverage goal) |
| Structural inconsistencies | 6 patterns | Low |

---

## General Folder/File Structure Conventions

### Component Folder (full)

```
component-name/
├── component-name.component.tsx       # React component
├── component-name.types.ts            # Props and local types (export type)
├── component-name.module.scss         # Scoped styles
├── component-name.constants.ts        # Static data / magic values
├── component-name.helpers.ts          # Pure helper functions
├── component-name.strings.ts          # UI string constants
├── index.ts                           # Barrel export
├── __tests__/
│   └── component-name.test.tsx        # Unit tests
└── components/                        # Sub-components (same structure recursively)
    ├── index.ts
    └── sub-component/
        ├── __tests__/
        │   └── sub-component-name.test.tsx        # Unit tests
        ├── sub-component.component.tsx
        ├── sub-component.types.ts
        └── index.ts
```

### Context Provider

```
feature/
├── feature.context.tsx                # createContext + Provider + useX hook
├── feature.types.ts                   # Context value type + related types
└── ...
```

### Custom Hook (standalone)

```
hooks/
├── index.ts
└── use-hook-name/
    ├── use-hook-name.hook.ts
    ├── use-hook-name.types.ts         # If the hook has params/return types
    ├── index.ts
    └── __tests__/
        └── use-hook-name.test.ts
```

### Custom Hook (co-located with component)

```
component-name/
├── component-name.component.tsx
├── hooks/
│   └── use-component-logic.hook.ts
└── ...
```

### Utility Function

```
utils/
├── utility-name.util.ts
├── utility-name.types.ts
└── __tests__/
    └── utility-name.test.ts
```

### Data / Constants File

```
data/
├── data-name.data.ts                  # or .data.tsx if it contains JSX
├── data-name.types.ts
└── __tests__/
    └── data-name.data.test.ts
```

### Demo Component

```
demos/
├── index.ts
└── demo-name/
    ├── demo-name.demo.tsx             # .demo.tsx suffix for demo components
    ├── demo-name.types.ts
    ├── demo-name.module.scss
    └── index.ts
```

### Next.js Route (page)

```
route-name/
├── page.tsx                           # Next.js page entry (thin — delegates to page component)
├── route-page.component.tsx           # Actual page component
├── route-page.types.ts
├── route-page.module.scss
├── components/                        # Page-scoped components
│   └── index.ts
└── data/                              # Page-scoped data (optional)
    ├── data-name.data.ts
    └── data-name.types.ts
```

### File Naming Rules

| Suffix | Purpose |
| --- | --- |
| `.component.tsx` | React component |
| `.demo.tsx` | Demo/showcase component |
| `.types.ts` | Type definitions (`export type`) |
| `.module.scss` | Scoped SCSS styles |
| `.constants.ts` | Static values / enums |
| `.helpers.ts` | Pure helper functions |
| `.strings.ts` | UI string constants |
| `.hook.ts` | Custom React hook |
| `.context.tsx` | React context + provider |
| `.data.ts` / `.data.tsx` | Data files |
| `.util.ts` | Utility functions |
| `.snippet.ts` | Code snippet functions |
| `.ascii.ts` | ASCII art strings |
| `.test.tsx` / `.test.ts` | Test files (inside `__tests__/`) |

All filenames use **kebab-case**. Suffixes use dot separators (e.g., `my-component.component.tsx`).
