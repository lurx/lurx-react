# Branch Separation Plan

All changes are currently on `main` (unstaged). We need to split them into logical branches/PRs. The strategy: stash everything, then cherry-pick groups of files onto separate branches from `main`.

## Workflow

```bash
# 1. Stash all changes (including untracked)
git stash --include-untracked

# 2. For each branch below:
git checkout -b <branch-name> main
git stash pop
git add <files for this branch>
git stash              # re-stash the remaining changes
git commit -m "<message>"
git push -u origin <branch-name>
gh pr create ...
git checkout main

# 3. After all branches are created, main is clean
```

---

## PR 1: `chore/update-claude-md`

Update CLAUDE.md with new conventions.

### Files

- `CLAUDE.md` (satisfies preference, callback prop naming)
- `.vscode/settings.json`

---

## PR 2: `refactor/remove-type-assertions`

Remove redundant type assertions enabled by the new `css.d.ts` augmentation, type narrowing, and `satisfies`.

### Files

**New file:**

- `src/@types/css.d.ts`

**CSS variable assertions removed (`as string`, `as React.CSSProperties`):**

- `src/app/(main)/games/data/snake-preview.component.tsx`
- `src/app/(main)/games/data/brickfall-preview.component.tsx`
- `src/app/(main)/games/data/pacman-preview.component.tsx`
- `src/demos/demo-container/demo-container.component.tsx`
- `src/games/rge-brickfall-game/rge-brickfall-game.component.tsx`
- `src/games/rge-snake-game/rge-snake-game.component.tsx`
- `src/games/rge-pacman-game/rge-pacman-game.component.tsx`
- `src/app/cv/sections/skills/skills.component.tsx`
- `src/app/components/user-avatar/user-avatar.component.tsx`

**Type narrowing & `satisfies` (eliminates assertions at source):**

- `src/app/cv/sections/contact/contact.component.tsx`
- `src/app/cv/utils/react-pdf/cv-document.constants.ts`
- `src/app/layout/social-bar/social-bar.constants.ts`
- `src/app/components/empty-state/empty-state.constants.ts`
- `src/app/components/technology-filter/technology-filter.constants.ts`
- `src/games/rge-brickfall-game/rge-brickfall-game.constants.ts`
- `src/games/rge-pacman-game/rge-pacman-game.constants.ts`

**Type narrowing — props widened from `string` to specific types:**

- `src/app/components/technology-filter/technology-filter.types.ts` (string → Technology)
- `src/app/components/technology-filter/tech-checkbox-item.types.ts` (string → Technology)
- `src/app/components/technology-filter/__tests__/tech-checkbox-item.test.tsx`
- `src/app/components/technology-filter/__tests__/technology-filter.test.tsx`
- `src/app/(main)/projects/components/projects-page/projects-page.component.tsx`
- `src/app/(main)/blog/blog-page.component.tsx`
- `src/app/(main)/blog/blog-page.helpers.ts`
- `src/app/(main)/about-me/data/about-files.data.ts`
- `src/app/(main)/about-me/components/file-tree/components/file-tree-section/file-tree-section.types.ts` (string[] → AboutFileId[])
- `src/app/(main)/about-me/components/file-tree/components/file-tree-section/file-tree-section.component.tsx`
- `src/app/(main)/about-me/components/file-tree/components/file-tree-section/__tests__/file-tree-section.test.tsx`
- `src/app/(main)/about-me/components/file-tree/__tests__/file-tree.test.tsx`
- `src/app/(main)/projects/components/project-card/project-card.component.tsx`
- `src/app/components/sign-in-dialog/components/sign-in-with-provider-button.component.tsx`
- `src/app/context/auth/auth.context.types.ts` (export AuthProvider)

**Type guards replacing unsafe casts:**

- `src/hooks/use-on-click-outside/use-on-click-outside.hook.ts`
- `src/app/(main)/about-me/components/tab-bar/tab-context-menu.component.tsx` (also touched by PR 4 — coordinate)
- `src/app/(main)/components/entry-animation/entry-animation.component.tsx`
- `src/app/components/user-settings-dialog/components/danger-zone-section/danger-zone-section.component.tsx` (also touched by PR 4)
- `src/app/components/comments/components/comment-form/comment-form.component.tsx` (also touched by PR 4)

**Helper extractions to remove assertions:**

- `src/app/layout/accessibility-widget/accessibility-widget.helpers.ts` (increment/decrementSpacingLevel)
- `src/games/rge-pacman-game/rge-pacman-game.helpers.ts` (getInitialGhostMode, GhostMode param, GHOST_NAMES)
- `src/games/rge-pacman-game/systems/move-ghosts.helpers.ts`

**Test files touched by assertion changes:**

- `src/app/(main)/blog/__tests__/blog-page.test.tsx` (also touched by PR 4)
- `src/app/(main)/projects/components/projects-page/__tests__/projects-page.test.tsx` (also touched by PR 4)
- `src/app/cv/sections/contact/__tests__/contact.test.tsx`

---

## PR 3: `refactor/unify-accessibility-controls`

Extract shared accessibility controls into a reusable hook + component, eliminating duplication between the footer widget and the settings dialog.

### Files

**New files:**

- `src/app/components/accessibility-controls/accessibility-controls.component.tsx`
- `src/app/components/accessibility-controls/accessibility-controls.module.scss`
- `src/app/components/accessibility-controls/accessibility-controls.types.ts`
- `src/app/components/accessibility-controls/index.ts`
- `src/app/layout/accessibility-widget/hooks/use-accessibility-settings/use-accessibility-settings.hook.ts`
- `src/app/layout/accessibility-widget/hooks/use-accessibility-settings/use-accessibility-settings.types.ts`
- `src/app/layout/accessibility-widget/hooks/use-accessibility-settings/index.ts`

**Modified:**

- `src/app/components/index.ts` (add AccessibilityControls export)
- `src/app/layout/accessibility-widget/accessibility-widget.component.tsx` (simplified)
- `src/app/layout/accessibility-widget/accessibility-widget.module.scss` (control styles removed)
- `src/app/layout/accessibility-widget/accessibility-widget.helpers.ts` (add helpers)
- `src/app/components/user-settings-dialog/components/accessibility-section/accessibility-section.component.tsx` (simplified)
- `src/app/components/user-settings-dialog/components/accessibility-section/__tests__/accessibility-section.test.tsx` (mock update)
- `src/app/components/user-settings-dialog/components/accessibility-section/accessibility-section.module.scss` (deleted content)

---

## PR 4: `refactor/rename-handler-props-action`

Rename all callback handler props from `onSomething` to `onSomethingAction` for Next.js "use client" compliance.

### Files

68 props renamed across ~90 files. All `.types.ts`, `.component.tsx`, and `__tests__/*.test.tsx` files that define, consume, or test callback props.

**Shared components (types + component + tests):**

- `dialog/`
- `resizable-drawer/` (including drawer-header)
- `technology-filter/` (filter + checkbox-item)
- `comments/` (comment-form, comment-item, sign-in-prompt)
- `social-actions-bar/`
- `sign-in-dialog/`
- `user-settings-dialog/` (dialog + danger-zone + logout)

**Feature pages (types + component + tests):**

- `about-me/` (tab-bar, tab, tab-context-menu, file-tree-section, sidebar, file-tree, about-content, about-page)
- `games/` (game-card, games-grid, game-dialog, games-page)
- `projects/` (project-card, project-card-footer, projects-grid, project-demo-drawer, projects-page)
- `blog/` (blog-post-card, blog-post-card-footer, blog-post-actions, blog-page)

**Game engine components (types + component + tests):**

- `rge-snake-game/` (game-overlay, game-controls)
- `rge-brickfall-game/` (game-overlay, game-controls)
- `rge-pacman-game/` (game-overlay, game-controls)
- `arrow-key-grid/`

**Layout:**

- `auth-button/` + `auth-dropdown/`

**Test utilities:**

- `__test-utils__/social-actions-bar.mock.tsx`

---

## Dependency Order

PRs 1, 2, and 3 are independent — can be merged in any order.

PR 4 has minor file overlaps with PR 2 (tab-context-menu, danger-zone-section, comment-form, blog-page test, projects-page test). These files have changes from both the type assertion removal AND the prop rename.

Merge PR 2 first, then rebase PR 4 onto the updated main.

**Merge order: PR 1 → PR 2 → PR 3 → PR 4**

---

## Notes

- All PRs should pass: `nx typecheck`, `nx test`, `nx lint`, `nx build`
- After all PRs merge, verify no regressions with a full build
