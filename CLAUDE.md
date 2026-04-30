# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Rotem's personal portfolio website built with Next.js 14, React 18, and GSAP in an Nx monorepo workspace. The project showcases advanced frontend development skills through a modern design system, sophisticated animations, and clean architecture.

## Architecture

### Monorepo Structure

- **Framework**: Nx 20.3.0 workspace with TypeScript and pnpm package manager
- **Apps**: `apps/rotem-is-a-dev/` - Main Next.js application, `apps/rotem-is-a-dev-e2e/` - E2E tests

### Technology Stack

- **Frontend**: Next.js 14.2.16, React 18.3.1, TypeScript 5.6.2
- **Styling**: SCSS modules with CSS custom properties for theming
- **Animations**: GSAP 3.14.2 for complex timelines and scroll-triggered effects
- **Utilities**: es-toolkit 1.39.10 for modern utility functions, usehooks-ts 3.1.1 for React hooks
- **Testing**: Jest with React Testing Library, Playwright for E2E
- **Linting**: ESLint with Next.js configuration

## Branching Workflow

Before starting any task, always ensure you're on a fresh branch from the latest `main`:

```bash
git checkout main && git pull && git checkout -b <branch-name>
```

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

> **Note**: General frontend conventions (TypeScript, component structure, Clean JSX, file naming, testing, styling) are defined in `~/.claude/CLAUDE.md` and apply across all projects. This section covers only project-specific additions.

### Project-Specific TypeScript

- **Global types**: Ambient declarations in `src/@types/*.d.ts` (e.g. `site-general.d.ts`, `error-page.d.ts`)
- **Utils path**: General-purpose utils live in `src/app/utils/` (e.g. `toggle-in-array.util.ts`)

### Animation Architecture

- **GSAP Integration**: Complex timelines with `gsap.timeline()` for sequenced animations
- **Cleanup**: Kill timelines and clear props in useEffect return for proper cleanup
- **Performance**: Respect `prefers-reduced-motion` preferences
- **Animation Testing**: Mock animation utilities for consistent testing

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

## SonarQube

- After finishing generating or modifying code files, call the `analyze_file_list` tool (if available) to analyze the created/modified files
- When starting a new task, disable automatic analysis with the `toggle_automatic_analysis` tool (if available)
- When done generating code, re-enable automatic analysis with `toggle_automatic_analysis` (if available)
- Don't guess project keys — use `search_my_sonarqube_projects` to look them up
- After fixing issues, don't verify via `search_sonar_issues_in_projects` as the server won't yet reflect updates
