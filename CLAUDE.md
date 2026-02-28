# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Rotem's personal portfolio website built with Next.js 14, React 18, and GSAP in an Nx monorepo workspace. The project showcases advanced frontend development skills through a modern design system, sophisticated animations, and clean architecture.

## Architecture

### Monorepo Structure

- **Framework**: Nx 20.3.0 workspace with TypeScript and Yarn package manager
- **Apps**: `apps/rotem-is-a-dev/` - Main Next.js application, `apps/rotem-is-a-dev-e2e/` - E2E tests

### Technology Stack

- **Frontend**: Next.js 14.2.16, React 18.3.1, TypeScript 5.6.2
- **Styling**: SCSS modules with CSS custom properties for theming
- **Animations**: GSAP 3.14.2 for complex timelines and scroll-triggered effects
- **Utilities**: es-toolkit 1.39.10 for modern utility functions, usehooks-ts 3.1.1 for React hooks
- **Testing**: Jest with React Testing Library, Playwright for E2E
- **Linting**: ESLint with Next.js configuration

## Common Development Commands

### Development Server

```bash
# Check if port 4200 is free before starting
if ! lsof -i:4200 >/dev/null 2>&1; then npx nx serve rotem-is-a-dev; fi
```

### Building

```bash
npx nx build rotem-is-a-dev

# Build everything
npx nx run-many --target=build --all
```

### Testing

```bash
# Unit tests for main app
npx nx test rotem-is-a-dev

# E2E tests
npx nx e2e rotem-is-a-dev-e2e

# Run all tests
npx nx run-many --target=test --all
```

### Linting and Type Checking

```bash
# Lint main application
npx nx lint rotem-is-a-dev
```

### Project Management

```bash
# Show project details
npx nx show project rotem-is-a-dev

# Visualize project dependencies
npx nx graph

# Generate new components
npx nx g @nx/react:lib mylib
npx nx g @nx/next:app demo
```

## Development Guidelines

### TypeScript Configuration

- **Strict mode enabled**: No `any` types allowed
- **Import types**: Use `import type` for type-only imports
- **Custom types**: Define in `src/types/` directories

### Animation Architecture

- **GSAP Integration**: Complex timelines with `gsap.timeline()` for sequenced animations
- **Cleanup**: Kill timelines and clear props in useEffect return for proper cleanup
- **Performance**: Respect `prefers-reduced-motion` preferences

### Styling Conventions

- **SCSS Modules**: All styles use `.module.scss` files imported as objects
- **Design Tokens**: Use CSS custom properties for design tokens
- **BEM-like Naming**: Follow established patterns in SCSS
- **Theming**: CSS custom properties for dynamic theming

### Component Development

- **Functional Components**: Use hooks, proper TypeScript typing for refs and state
- **File Structure**: Component folder with .tsx, .types.ts, .module.scss, **tests**/
- **100% Test Coverage**: Comprehensive unit tests required

### Component Internal Structure (The "React Sandwich")

Follow this exact order inside every function component:

1. **Props destructuring** — the component's contract
2. **State** (`useState`) — internal memory
3. **Refs** (`useRef`) — persistent containers
4. **Context** (`useContext`) — external data sources
5. **Custom hooks** — encapsulated logic
6. **Memoized values** (`useMemo`) — derived data
7. **Callbacks / handlers** (`useCallback`, `handleX`) — event logic
8. **Effects** (`useEffect`) — side effects, always last among hooks
9. **Guard clauses** (early returns) — after all hooks, before render
10. **Render helpers** — small functions that return JSX fragments
11. **Return JSX** — the final output

### Clean JSX Rules

- **No ternaries in JSX**: Extract conditional rendering to render helper functions or separate components. Even simple ternaries harm readability at scale.
- **No inline functions in JSX props**: Extract arrow functions to named constants or `useCallback`. Inline functions break `React.memo` and `useMemo`.
- **No magic values**: Hardcoded numbers and strings must be named constants. Use design tokens and CSS custom properties.
- **No blind prop spreading**: Be explicit about which props a component receives. `{...props}` is only acceptable in pass-through wrappers or HOCs.
- **Extract large `.map()` bodies**: If the JSX inside `.map()` is more than a single component call, extract it to a dedicated component.
- **Use stable, unique keys**: Never use array index as key unless the list is completely static. Use item IDs or other stable identifiers.
- **Minimize nesting depth**: If JSX exceeds 4-5 levels of nesting, extract inner blocks to components or render helpers.
- **Logic before render**: All computation, conditions, and data transformations belong in variables, hooks, or helper functions — not inline in JSX.

### Third-Party Tools

- **es-toolkit**: Use for utility functions (throttle, debounce, isEmpty, pick)
- **usehooks-ts**: Use for React hook patterns (useMediaQuery, useLocalStorage, useDebounce)
- **Always prefer these over custom implementations**

## Code Quality Standards

### Testing Requirements

- **100% Coverage**: All components and utilities must have comprehensive tests
- **React Testing Library**: For component behavior testing
- **Jest Configuration**: Custom setup with DOM testing utilities
- **Animation Testing**: Mock animation utilities for consistent testing

### File Naming and Structure

- **kebab-case**: All files use lowercase kebab-case naming
- **Component Structure**: `component-name.tsx`, `component-name.module.scss`, `component-name.types.ts`
- **Test Files**: Located in `__tests__/` folders with `.test.tsx` extension

### Code Standards

- **SOLID Principles**: Apply in all code design
- **Descriptive Names**: No single-letter variables
- **TypeScript Strict**: Fix all TypeScript and ESLint errors before committing
- **Animation Cleanup**: Proper cleanup in useEffect for all animations

## Project-Specific Patterns

### Animation Implementation

```typescript
// GSAP timeline with proper cleanup
useEffect(() => {
	const tl = gsap.timeline();

	tl.from('[data-animate]', {
		opacity: 0,
		duration: 0.45,
		ease: 'power2.inOut',
	});

	return () => {
		tl.kill();
		gsap.set('[data-animate]', { clearProps: 'all' });
	};
}, []);
```

## Troubleshooting

- **Port Issues**: Check if development server is already running on port 4200
- **Animation Issues**: Verify proper cleanup and scoping patterns
- **Import Errors**: Check TypeScript path mapping in tsconfig.base.json
- **Railway / network CLIs**: The agent's terminal has no network. Run `./scripts/railway-status.sh` in your Cursor terminal; the agent will read the output from the terminals folder. See `.cursor/rules/railway-network-cli.mdc`.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
