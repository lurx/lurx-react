---
applyTo: '**'
---

# Rotem's React Portfolio Project Instructions

You are working on Rotem's personal portfolio website built with Next.js, React, and AnimJS in an Nx monorepo workspace.

## Project Overview

This is a personal portfolio website showcasing Rotem's development skills. The main application is called `rotem-is-a-dev` and features:

- Modern React 18 with Next.js 14
- Advanced animations using AnimeJS
- TypeScript for type safety
- SCSS for styling
- Nx workspace for project management

## Technology Stack

- **Framework**: Next.js 14.2.16 with React 18.3.1
- **Language**: TypeScript with strict type checking
- **Styling**: SCSS modules
- **Animations**: AnimeJS 4.0.2 for complex animations and scroll-triggered effects
- **Utilities**: es-toolkit 1.39.10 for modern utility functions (throttle, debounce, etc.)
- **Hooks**: usehooks-ts 3.1.1 for modern React hooks (useMediaQuery, useLocalStorage, etc.)
- **Monorepo**: Nx 20.3.0 with yarn package manager
- **Testing**: Jest with React Testing Library
- **E2E Testing**: Playwright
- **Linting**: ESLint with Next.js config

## Third-Party Tools Integration

### es-toolkit
- Modern utility library for JavaScript/TypeScript
- Use for common utilities like `throttle`, `debounce`, `isEmpty`, `pick`, etc.
- Replaces Lodash with better performance and tree-shaking
- Always prefer es-toolkit over custom implementations for utility functions

### usehooks-ts
- Collection of essential React hooks written in TypeScript
- Use for common patterns like `useMediaQuery`, `useLocalStorage`, `useDebounce`, etc.
- Provides type-safe, well-tested hook implementations
- Always prefer usehooks-ts over custom hook implementations for common patterns

## Key Features

### Animation System

- Uses AnimeJS for sophisticated animations
- Scroll-triggered animations with `onScroll` API
- Scoped animation instances for performance
- Timeline-based animations with easing functions
- Proper cleanup of animation instances

### Project Structure

- `apps/rotem-is-a-dev/` - Main Next.js application
- `apps/rotem-is-a-dev-e2e/` - E2E tests
- Personal data in `src/data/my-details.json`
- Type definitions in `src/types/`
- Modular SCSS with CSS modules

## Development Guidelines

### TypeScript Best Practices

- Use `import type` for type-only imports (auto-configured in VS Code)
- Define custom types in `src/types/` directory
- Use `Nullable<T>` utility type for optional values
- Strict type checking enabled
- No single-letter variables - use descriptive names
- Always fix TypeScript errors before committing
- Follow SOLID principles for better code architecture

### Third-Party Tools Usage

- **Always use es-toolkit** for utility functions instead of writing custom implementations
- **Always use usehooks-ts** for common React hook patterns
- Check es-toolkit and usehooks-ts documentation before implementing utility functions or hooks
- These tools provide better performance, type safety, and are well-tested

### File Naming Conventions

- All files use kebab-case, lowercase only
- Components: `component-name.tsx`
- Styles: `component-name.module.scss`
- Types: `type-definitions.ts`
- Utilities: `utility-function.ts`

### Animation Guidelines

- Always use scoped animations with `createScope()`
- Properly cleanup animations in useEffect cleanup
- Use timeline-based animations for complex sequences
- Debug scroll animations with `debug: true` during development

### Styling Conventions

- Use SCSS modules (`.module.scss` files)
- Import styles as `styles` object
- Use CSS custom properties for theming
- Follow BEM-like naming in SCSS

### Component Structure

- Functional components with hooks
- Use `useRef` for DOM element references
- Proper TypeScript typing for refs and state
- Export default components
- Apply SOLID principles: Single Responsibility, Open/Closed, etc.
- Always fix ESLint warnings and errors before committing

### Code Quality Standards

- Maintain 100% test coverage for all components and utilities
- Write comprehensive unit tests with Jest and React Testing Library
- Include integration tests for complex user interactions
- Test edge cases and error scenarios
- Mock external dependencies appropriately

## Common Tasks

### Running the Application

```bash
npx nx dev rotem-is-a-dev
```

### Building for Production

```bash
npx nx build rotem-is-a-dev
```

### Running Tests

```bash
npx nx test rotem-is-a-dev
npx nx e2e rotem-is-a-dev-e2e
```

### Linting

```bash
npx nx lint rotem-is-a-dev
```

## Animation Patterns

### Scroll-Triggered Animations

```typescript
createTimeline({
	defaults: {
		ease: 'linear',
		duration: 500,
		composition: 'blend',
	},
	autoplay: onScroll({
		target: `.${styles.element}`,
		enter: 'top top',
		leave: 'bottom bottom',
		sync: 0.1,
	}),
});
```

### Scoped Animation Setup

```typescript
const animationScope = useRef<Nullable<Scope>>(null);

useEffect(() => {
	animationScope.current = createScope({ root }).add(scopedAnimations => {
		// Animation logic here
	});

	return () => animationScope.current?.revert();
}, []);
```

## Content Management

- Personal information stored in `my-details.json`
- Easy to update without touching component code
- Structured data for title, introduction, and CTAs

## Performance Considerations

- Animation scoping prevents memory leaks
- Proper cleanup in useEffect
- CSS modules for scoped styling
- Next.js optimization features enabled

## When Working on This Project

1. Always maintain animation cleanup patterns
2. Use TypeScript strictly - no `any` types
3. Follow the established SCSS module pattern
4. Keep personal data in JSON files
5. Test animations across different screen sizes
6. Use the Nx tools for project management
7. Maintain the modern, clean aesthetic
8. Use descriptive variable names - no single-letter variables
9. Follow kebab-case, lowercase naming for all files
10. Apply SOLID principles in all code design
11. Achieve and maintain 100% test coverage
12. Fix all TypeScript and ESLint errors before committing
13. Write tests first when adding new features (TDD approach)
14. Use `import type` for type-only imports
15. Document complex animation sequences in comments
16. Use CSS custom properties for theming
17. Ensure accessibility in all components according to WCAG 2.1AA standards (ARIA roles, keyboard navigation, color contrast)
18. Use React Testing Library for component tests
19. Use Playwright for end-to-end tests

## Markdown Guidelines

### Markdownlint Compliance

- Follow markdownlint rules to ensure consistent documentation
- All headings must be surrounded by blank lines
- All lists must be surrounded by blank lines
- Fenced code blocks must have language specified
- Fenced code blocks must be surrounded by blank lines

### Markdown Best Practices

- Use proper heading hierarchy (h1 → h2 → h3)
- Add blank lines around all headings
- Add blank lines around all lists
- Specify language for all code blocks (`typescript, `scss, ```bash, etc.)
- Add blank lines before and after code blocks
- Use consistent list formatting
- Ensure proper indentation for nested lists

### Example of Proper Markdown Structure

````markdown
# Main Heading

## Section Heading

### Subsection Heading

Paragraph text with proper spacing.

- List item 1
- List item 2
- List item 3

Another paragraph after the list.

```typescript
// Code block with language specified
const example = 'proper formatting';
```
````

More content after code block.

```

```
