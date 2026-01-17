# Component Naming Conventions & Architecture

## 📁 File Structure

```text
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.module.scss
│   │   │   ├── button.test.tsx
│   │   │   └── index.ts
│   │   ├── input/
│   │   ├── card/
│   │   └── ...
│   ├── sections/              # Page sections
│   │   ├── hero-section/
│   │   ├── about-section/
│   │   ├── projects-section/
│   │   └── ...
│   ├── animations/            # Animation components
│   │   ├── fade-in/
│   │   ├── slide-up/
│   │   ├── parallax-container/
│   │   └── ...
│   └── layout/                # Layout components
│       ├── header/
│       ├── footer/
│       ├── container/
│       └── ...
├── hooks/                     # Custom React hooks
│   ├── use-animation-scope.ts
│   ├── use-intersection-observer.ts
│   └── ...
├── utils/                     # Utility functions
│   ├── animation-helpers.ts
│   ├── dom-helpers.ts
│   └── ...
├── types/                     # TypeScript definitions
│   ├── animation.types.ts
│   ├── component.types.ts
│   └── ...
├── data/                      # Static data and configuration
│   ├── my-details.json
│   ├── projects.json
│   └── ...
└── styles/                    # Global styles and design tokens
    ├── design-tokens.scss
    ├── utilities.scss
    ├── globals.scss
    └── ...
```

## 🏷️ Naming Conventions

### Files and Folders

- **All lowercase, kebab-case**: `hero-section.tsx`, `animated-button.module.scss`
- **Components folder**: Named after the component: `button/`, `hero-section/`
- **Component files**: `component-name.tsx`
- **Style files**: `component-name.module.scss`
- **Test files**: `component-name.test.tsx`
- **Type files**: `component-name.types.ts`
- **Index files**: `index.ts` (for barrel exports)

### TypeScript Components

- **Component names**: PascalCase `HeroSection`, `AnimatedButton`
- **Props interfaces**: `ComponentNameProps`
- **Ref types**: `ComponentNameRef`
- **State types**: `ComponentNameState`

### SCSS Classes

- **Module classes**: camelCase (CSS Modules style)
- **BEM-inspired structure** within modules:

  ```scss
  .container { } // Block
  .header { }    // Element
  .isActive { }  // Modifier (camelCase)
  .hasError { }  // Modifier (camelCase)
  ```

### Hooks

- **Custom hooks**: `use-` prefix with kebab-case file names
- **Hook functions**: camelCase `useAnimationScope`, `useIntersectionObserver`

### Utilities

- **Utility files**: kebab-case `animation-helpers.ts`
- **Function names**: camelCase `createAnimationScope`, `getElementPosition`

## 🏗️ Component Architecture Patterns

### Basic UI Component Structure

```typescript
// components/ui/button/button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.isLoading]: isLoading,
          [styles.isDisabled]: disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loader} aria-hidden="true" />
      ) : null}
      <span className={styles.content}>{children}</span>
    </button>
  );
}
```

### Section Component Structure

```typescript
// components/sections/hero-section/hero-section.tsx
import { useEffect, useRef } from 'react';
import type { Nullable } from '@/types/general';
import { useAnimationScope } from '@/hooks/use-animation-scope';
import styles from './hero-section.module.scss';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  onCtaClick,
}: HeroSectionProps) {
  const containerRef = useRef<Nullable<HTMLElement>>(null);
  const animationScope = useAnimationScope(containerRef);

  useEffect(() => {
    if (!animationScope.current) return;

    animationScope.current.add(() => {
      // Animation logic here
    });
  }, [animationScope]);

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <button className={styles.cta} onClick={onCtaClick}>
          {ctaText}
        </button>
      </div>
    </section>
  );
}
```

### Animation Component Structure

```typescript
// components/animations/fade-in/fade-in.tsx
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Nullable } from '@/types/general';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import styles from './fade-in.module.scss';

export interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 500,
  threshold = 0.1,
  triggerOnce = true,
}: FadeInProps) {
  const elementRef = useRef<Nullable<HTMLDivElement>>(null);
  const isVisible = useIntersectionObserver(elementRef, {
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    if (isVisible) {
      element.style.setProperty('--fade-delay', `${delay}ms`);
      element.style.setProperty('--fade-duration', `${duration}ms`);
      element.classList.add(styles.isVisible);
    } else if (!triggerOnce) {
      element.classList.remove(styles.isVisible);
    }
  }, [isVisible, delay, duration, triggerOnce]);

  return (
    <div ref={elementRef} className={styles.container}>
      {children}
    </div>
  );
}
```

## 📦 Export Patterns

### Barrel Exports (index.ts files)

```typescript
// components/ui/index.ts
export { default as Button } from './button';
export { default as Input } from './input';
export { default as Card } from './card';

// Export types
export type { ButtonProps } from './button/button';
export type { InputProps } from './input/input';
export type { CardProps } from './card/card';
```

### Component Folder index.ts

```typescript
// components/ui/button/index.ts
export { default } from './button';
export type { ButtonProps } from './button';
```

## 🎯 Component Categories

### UI Components (`components/ui/`)

- **Basic Elements**: Button, Input, Select, Checkbox, etc.
- **Data Display**: Card, Badge, Avatar, Tooltip, etc.
- **Feedback**: Alert, Modal, Toast, Loading, etc.
- **Navigation**: Tabs, Breadcrumb, Pagination, etc.

### Section Components (`components/sections/`)

- **Page Sections**: HeroSection, AboutSection, ProjectsSection, etc.
- **Layout Sections**: HeaderSection, FooterSection, etc.

### Animation Components (`components/animations/`)

- **Reveal Animations**: FadeIn, SlideUp, ScaleIn, etc.
- **Continuous Animations**: FloatingElement, PulseEffect, etc.
- **Interactive Animations**: HoverEffect, ClickRipple, etc.
- **Scroll Animations**: ParallaxContainer, ScrollProgress, etc.

### Layout Components (`components/layout/`)

- **Structural**: Container, Grid, Stack, etc.
- **Navigation**: Header, Footer, Sidebar, etc.
- **Wrappers**: PageWrapper, SectionWrapper, etc.

## 🔧 Props Patterns

### Standard Props Interface

```typescript
export interface ComponentProps {
  // Required props first
  title: string;

  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';

  // Boolean props with default false
  isLoading?: boolean;
  isDisabled?: boolean;

  // Event handlers
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;

  // Children and content
  children?: ReactNode;

  // HTML attributes (when extending HTML elements)
  className?: string;
  'data-testid'?: string;
}
```

### Animation Props Pattern

```typescript
export interface AnimationProps {
  delay?: number;
  duration?: number;
  easing?: string;
  triggerOnce?: boolean;
  threshold?: number;
}
```

## 📝 Documentation Standards

### Component Documentation Template

```typescript
/**
 * Button component with multiple variants and states
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export default function Button({ ... }: ButtonProps) {
  // Component implementation
}
```

### README Template for Complex Components

Each complex component should include a README.md with:

- Purpose and use cases
- Props documentation
- Usage examples
- Animation details (if applicable)
- Accessibility considerations
- Testing approach

This architecture provides a solid foundation for scalable, maintainable, and well-organized React components following modern best practices.
