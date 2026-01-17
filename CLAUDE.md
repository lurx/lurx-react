# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Rotem's personal portfolio website built with Next.js 14, React 18, and AnimeJS in an Nx monorepo workspace. The project showcases advanced frontend development skills through a modern design system, sophisticated animations, and clean architecture.

## Architecture

### Monorepo Structure

- **Framework**: Nx 20.3.0 workspace with TypeScript and Yarn package manager
- **Apps**: `apps/rotem-is-a-dev/` - Main Next.js application, `apps/rotem-is-a-dev-e2e/` - E2E tests
- **Libraries**: `libs/vanguardis/` - Custom design system library
- **Dependencies**: Vanguardis library must be built before the main app can run

### Technology Stack

- **Frontend**: Next.js 14.2.16, React 18.3.1, TypeScript 5.6.2
- **Styling**: SCSS modules with CSS custom properties for theming
- **Animations**: AnimeJS 4.0.2 for complex animations and scroll-triggered effects
- **Utilities**: es-toolkit 1.39.10 for modern utility functions, usehooks-ts 3.1.1 for React hooks
- **Testing**: Jest with React Testing Library, Playwright for E2E
- **Linting**: ESLint with Next.js configuration

### Vanguardis Design System

Vanguardis is the single source of truth for all UI components and styling:

- **Build Target**: Built to `dist/libs/vanguardis/` with source maps
- **Core Components**: VanguardisProvider, LoadingScreen, PageTransition, Animation components
- **Architecture**: TypeScript paths point to source during development, distribution at runtime
- **Requirements**: 100% test coverage for all components

## Common Development Commands

### Development Server

```bash
# Check if port 4200 is free before starting
if ! lsof -i:4200 >/dev/null 2>&1; then npx nx serve rotem-is-a-dev; fi
```

### Building

```bash
# Build main application (requires Vanguardis first)
npx nx build rotem-is-a-dev

# Build design system library
npx nx build vanguardis

# Build everything
npx nx run-many --target=build --all
```

### Testing

```bash
# Unit tests for main app
npx nx test rotem-is-a-dev

# Unit tests for design system
npx nx test vanguardis

# E2E tests
npx nx e2e rotem-is-a-dev-e2e

# Run all tests
npx nx run-many --target=test --all
```

### Linting and Type Checking

```bash
# Lint main application
npx nx lint rotem-is-a-dev

# Lint design system
npx nx lint vanguardis

# TypeScript check (via Vite plugin)
npx nx typecheck vanguardis
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
- **Path mapping**: `@lurx-react/vanguardis` → `libs/vanguardis/src`, styles → `dist/libs/vanguardis/style.css`
- **Import types**: Use `import type` for type-only imports
- **Custom types**: Define in `src/types/` directories

### Animation Architecture

- **AnimeJS Integration**: Complex timelines with scroll-triggered animations
- **Scoped Animations**: Use `createScope()` for proper cleanup
- **Performance**: Respect `prefers-reduced-motion` preferences
- **Vanguardis Components**: FadeIn, SlideIn, ScaleIn, StaggerFadeIn

### Styling Conventions

- **SCSS Modules**: All styles use `.module.scss` files imported as objects
- **Design Tokens**: Use Vanguardis design tokens instead of hardcoded values
- **BEM-like Naming**: Follow established patterns in SCSS
- **Theming**: CSS custom properties for dynamic theming

### Component Development

- **Vanguardis First**: All UI components must be added to Vanguardis library first
- **Functional Components**: Use hooks, proper TypeScript typing for refs and state
- **File Structure**: Component folder with .tsx, .types.ts, .module.scss, **tests**/
- **100% Test Coverage**: Comprehensive unit tests required

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
// Scoped animation setup
const animationScope = useRef<Nullable<Scope>>(null);

useEffect(() => {
	animationScope.current = createScope({ root }).add(scopedAnimations => {
		// Animation logic here
	});

	return () => animationScope.current?.revert();
}, []);
```

### Scroll-Triggered Animations

```typescript
createTimeline({
	defaults: { ease: 'linear', duration: 500, composition: 'blend' },
	autoplay: onScroll({
		target: `.${styles.element}`,
		enter: 'top top',
		leave: 'bottom bottom',
		sync: 0.1,
	}),
});
```

### Vanguardis Usage Pattern

```typescript
// Import components from Vanguardis
import { FadeIn, SlideIn, VanguardisProvider } from '@lurx-react/vanguardis';
import '@lurx-react/vanguardis/style';

// Wrap app with provider
<VanguardisProvider>
  <App />
</VanguardisProvider>

// Use animation components
<FadeIn delay={200} duration={600}>
  <ComponentToAnimate />
</FadeIn>
```

## Build Dependencies

### Critical Build Order

1. **Vanguardis must be built first**: Main app depends on built distribution
2. **Development vs Production**: TypeScript paths point to source, runtime loads from dist
3. **Style Loading**: CSS imported separately via `@lurx-react/vanguardis/style`

### Troubleshooting

- **Build Failures**: Ensure Vanguardis is built before main app
- **Port Issues**: Check if development server is already running on port 4200
- **Animation Issues**: Verify proper cleanup and scoping patterns
- **Import Errors**: Check TypeScript path mapping in tsconfig.base.json

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
