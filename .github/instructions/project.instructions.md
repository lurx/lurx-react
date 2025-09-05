---
applyTo: '**'
---

# Rotem's React Portfolio Project Instructions

You are working on Rotem's personal portfolio website built with Next.js, React, and AnimJS in an Nx monorepo workspace.

## Project Overview

This is a personal portfolio website showcasing Rotem's development skills. The main application is called `rotem-is-a-dev` and features:

- Modern React 18 with Next.js 14
- Advanced animations using AnimeJS
- Custom Vanguardis design system library
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

## Vanguardis Design System

Vanguardis is a custom design system library built specifically for this project. It provides a comprehensive set of UI components, animations, and utilities that serve as the single source of truth for styling and interactions.

### Architecture

- **Location**: `libs/vanguardis/` - Standalone Nx library
- **Build**: Vite-based library build with TypeScript and SCSS
- **Testing**: Jest with React Testing Library (100% test coverage)
- **Distribution**: Built to `dist/libs/vanguardis/` with source maps

### Core Components

- **VanguardisProvider**: Context provider for global design system configuration
- **LoadingScreen**: Customizable loading screens with progress indicators
- **PageTransition**: Advanced page transitions (fade, slide, curtain, ripple)
- **Animation Components**: FadeIn, SlideIn, ScaleIn, StaggerFadeIn for reveal animations

### Styling Foundation

- **Global Styles**: CSS reset, design tokens, and utility classes
- **Design Tokens**: Centralized color palette, typography, spacing, and breakpoints
- **SCSS Architecture**: Modular SCSS with design token integration
- **CSS Custom Properties**: Dynamic theming support

### Animation System

- **AnimeJS Integration**: Sophisticated animations with timeline support
- **Scroll Animations**: Intersection Observer-based reveal animations
- **Motion Preferences**: Respects `prefers-reduced-motion` for accessibility
- **Performance**: Scoped animations with proper cleanup

### TypeScript Integration

- **Full Type Safety**: Comprehensive TypeScript definitions
- **Design System Types**: Centralized type definitions for consistency
- **Component Props**: Strongly typed component interfaces
- **Animation Types**: Type-safe animation configuration

### Usage Patterns

```typescript
// Import components from Vanguardis
import { FadeIn, SlideIn, VanguardisProvider } from '@lurx-react/vanguardis';

// Import styles (handled automatically via provider)
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

### Development Guidelines

- **Single Source of Truth**: All UI components and styles should use Vanguardis
- **No External UI Libraries**: Vanguardis replaces the need for Bootstrap, Material-UI, etc.
- **Component Development**: New UI components should be added to Vanguardis first
- **Style Consistency**: Use Vanguardis design tokens for colors, spacing, typography
- **Animation Standards**: Use Vanguardis animation components for consistency

### Build and Distribution

- **Development**: TypeScript paths point to source (`libs/vanguardis/src`)
- **Runtime**: CSS and JS load from built distribution (`dist/libs/vanguardis/`)
- **Source Maps**: Full source map support for debugging and CMD+click navigation
- **Package Exports**: Proper module exports for both development and production

### Testing Standards

- **Jest Configuration**: Custom Jest setup with DOM testing utilities
- **Test Coverage**: Maintain 100% test coverage for all components
- **Component Testing**: React Testing Library for component behavior
- **Animation Testing**: Mock animation utilities for consistent testing
- **TypeScript Testing**: Full type checking in test files

### Project Structure

- `apps/rotem-is-a-dev/` - Main Next.js application
- `apps/rotem-is-a-dev-e2e/` - E2E tests
- `libs/vanguardis/` - Custom design system library
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

- Use Vanguardis animation components (FadeIn, SlideIn, etc.) for consistency
- Always use scoped animations with `createScope()`
- Properly cleanup animations in useEffect cleanup
- Use timeline-based animations for complex sequences
- Debug scroll animations with `debug: true` during development
- Respect motion preferences via Vanguardis utilities

### Styling Conventions

- Use SCSS modules (`.module.scss` files)
- Import styles as `styles` object
- Use Vanguardis design tokens for consistency
- Follow BEM-like naming in SCSS
- Leverage Vanguardis CSS custom properties for theming
- Always import global styles via `@lurx-react/vanguardis/style`

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

Always check if port 4200 is free before running the app. If it's not, the project is already running.

```bash
# check if port 4200 is free, if it's free, serve the app. if not, do nothing.
if ! lsof -i:4200 >/dev/null 2>&1; then npx nx serve rotem-is-a-dev; fi
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
npx nx lint vanguardis
```

### Vanguardis Development

```bash
# Build the design system library
npx nx build vanguardis

# Test the design system
npx nx test vanguardis

# Lint the design system
npx nx lint vanguardis

# Build and test everything
npx nx run-many --target=build,test --all
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
20. **Always use Vanguardis as the single source of truth for styling**
21. **Build Vanguardis library before testing dependent apps**
22. **Add new UI components to Vanguardis first, then consume them**
23. **Use Vanguardis design tokens instead of hardcoded values**
24. **Test Vanguardis components independently before integration**

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
