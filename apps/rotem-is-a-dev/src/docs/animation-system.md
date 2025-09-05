# Animation System Documentation

This document provides comprehensive documentation for the animation system built with AnimeJS, providing type-safe, performant, and accessible animations.

## Overview

The animation system consists of:

- **Types**: Comprehensive TypeScript definitions for all animation configurations
- **Utilities**: Core utilities for motion preferences, performance monitoring, and easing functions
- **Hooks**: React hooks for managing animation scopes, motion preferences, and scroll animations
- **Components**: Reusable animation components for common patterns

## Architecture

```text
src/
├── types/
│   └── animation.types.ts          # All animation type definitions
├── utils/
│   └── animation.utils.ts          # Core animation utilities
├── hooks/
│   ├── use-animation.hooks.ts      # Core animation hooks
│   └── use-scroll-animation.hooks.ts # Scroll-based animation hooks
└── components/
    └── animations/
        ├── reveal-animations.tsx   # Reveal animation components
        └── index.ts               # Animation component exports
```

## Type System

### Core Types

```typescript
// Animation timing configuration
interface AnimationTiming {
  duration: number;
  delay?: number;
  ease: string;
  composition?: 'replace' | 'add' | 'accumulate' | 'blend';
}

// Motion preferences for accessibility
interface MotionPreferences {
  prefersReducedMotion: boolean;
  motionLevel: 'none' | 'reduced' | 'full';
}

// Animation scope reference for cleanup
interface AnimationScopeRef {
  scope: Nullable<Scope>;
  cleanup: () => void;
}
```

### Configuration Types

```typescript
// Hook configuration
interface UseAnimationConfig {
  respectMotionPreference?: boolean;
  defaultTiming?: Partial<AnimationTiming>;
  enablePerformanceMonitoring?: boolean;
  autoCleanup?: boolean;
}

// Scroll animation configuration
interface ScrollAnimationConfig {
  target: string | Element;
  enter: string;
  leave: string;
  sync: number;
  debug?: boolean;
}
```

## Core Utilities

### Motion Preferences

```typescript
import { getMotionPreferences, shouldReduceMotion, setMotionPreference } from '@/utils/animation.utils';

// Get current motion preferences
const preferences = getMotionPreferences();
// { prefersReducedMotion: false, motionLevel: 'full' }

// Check if motion should be reduced
if (shouldReduceMotion()) {
  // Skip animations or use reduced motion
}

// Set custom motion preference
setMotionPreference('reduced');
```

### Easing Functions

```typescript
import { easingFunctions } from '@/utils/animation.utils';

// Pre-defined cubic-bezier easing functions
const timeline = createTimeline({
  defaults: {
    ease: easingFunctions.spring, // Custom spring easing
    duration: 500
  }
});
```

### Performance Monitoring

```typescript
import { startAnimationMonitoring, stopAnimationMonitoring } from '@/utils/animation.utils';

// Monitor animation performance
const animationId = 'my-animation';
startAnimationMonitoring(animationId);

// ... run animations ...

stopAnimationMonitoring(animationId);
```

## React Hooks

### useAnimationScope

Manages AnimeJS scoped animations with automatic cleanup.

```typescript
import { useAnimationScope } from '@/hooks/use-animation.hooks';

function MyComponent() {
  const { scope, cleanup } = useAnimationScope(
    (scope) => {
      // Define animations within the scope
      scope.createTimeline({
        '.element': {
          translateY: [50, 0],
          opacity: [0, 1]
        }
      });
    },
    {
      respectMotionPreference: true, // Skip if user prefers reduced motion
      autoCleanup: true,             // Cleanup on unmount
      enablePerformanceMonitoring: false
    }
  );

  // Manual cleanup if needed
  const handleCleanup = () => {
    cleanup();
  };

  return <div className="animated-component">...</div>;
}
```

### useMotionPreferences

Manages motion preferences with live updates and local storage persistence.

```typescript
import { useMotionPreferences } from '@/hooks/use-animation.hooks';

function AnimationSettings() {
  const { prefersReducedMotion, motionLevel, setMotionLevel } = useMotionPreferences();

  return (
    <div>
      <p>Current motion level: {motionLevel}</p>
      <button onClick={() => setMotionLevel('reduced')}>
        Reduce Motion
      </button>
      <button onClick={() => setMotionLevel('full')}>
        Full Motion
      </button>
    </div>
  );
}
```

### useScrollAnimation

Creates scroll-triggered animations with intersection observer optimization.

```typescript
import { useScrollAnimation } from '@/hooks/use-scroll-animation.hooks';

function ScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useScrollAnimation(
    containerRef,
    {
      target: '.reveal-element',
      enter: 'top bottom',
      leave: 'bottom top',
      sync: 0.1
    },
    (scope) => {
      scope.createTimeline({
        '.reveal-element': {
          translateY: [100, 0],
          opacity: [0, 1],
          scale: [0.8, 1]
        }
      });
    }
  );

  return (
    <div ref={containerRef}>
      <div className="reveal-element">Animated content</div>
    </div>
  );
}
```

### useAnimationState

Tracks animation state and performance metrics.

```typescript
import { useAnimationState } from '@/hooks/use-animation.hooks';

function AnimationDebugger() {
  const {
    isAnimating,
    progress,
    performance,
    startAnimation,
    stopAnimation,
    updateProgress
  } = useAnimationState('my-animation', true);

  return (
    <div>
      <p>Animating: {isAnimating ? 'Yes' : 'No'}</p>
      <p>Progress: {Math.round(progress * 100)}%</p>
      <p>Frame Rate: {performance.frameRate} fps</p>
      <button onClick={startAnimation}>Start</button>
      <button onClick={stopAnimation}>Stop</button>
    </div>
  );
}
```

## Animation Components

### RevealAnimation

Pre-built reveal animation with customizable options.

```typescript
import { RevealAnimation } from '@/components/animations';

function MyPage() {
  return (
    <div>
      <RevealAnimation
        direction="up"
        delay={200}
        duration={800}
        threshold={0.2}
      >
        <h1>This content will be revealed</h1>
      </RevealAnimation>

      <RevealAnimation
        direction="scale"
        stagger={100}
        debug={true}
      >
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </RevealAnimation>
    </div>
  );
}
```

### StaggeredList

Animate lists with staggered timing.

```typescript
import { StaggeredList } from '@/components/animations';

function Portfolio() {
  const projects = [/* ... */];

  return (
    <StaggeredList
      stagger={150}
      direction="up"
      threshold={0.1}
    >
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </StaggeredList>
  );
}
```

## Best Practices

### Accessibility

```typescript
// Always respect motion preferences
const { scope } = useAnimationScope(
  (scope) => {
    // Animation setup
  },
  { respectMotionPreference: true } // Default: true
);

// Provide alternative experiences
if (shouldReduceMotion()) {
  // Use CSS transitions instead of complex animations
  element.style.transition = 'opacity 0.2s ease';
} else {
  // Full animation experience
  scope.createTimeline({ /* complex animation */ });
}
```

### Performance

```typescript
// Use scoped animations for better performance
const { scope } = useAnimationScope((scope) => {
  // All animations are automatically scoped
  scope.createTimeline({
    '.element': { /* animation properties */ }
  });
});

// Enable performance monitoring in development
const config = {
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development'
};
```

### Memory Management

```typescript
// Automatic cleanup with autoCleanup: true (default)
useAnimationScope(animationSetup, { autoCleanup: true });

// Manual cleanup when needed
const { cleanup } = useAnimationScope(animationSetup, { autoCleanup: false });

useEffect(() => {
  return () => {
    cleanup(); // Clean up when component unmounts
  };
}, [cleanup]);
```

### Error Handling

```typescript
// Animations are wrapped in try-catch blocks
const { scope } = useAnimationScope((scope) => {
  try {
    scope.createTimeline({
      '.element': {
        translateX: [0, 100],
        // Potential animation errors are caught automatically
      }
    });
  } catch (error) {
    console.error('Animation setup failed:', error);
    // Fallback behavior
  }
});
```

## Common Patterns

### Page Transitions

```typescript
function PageTransition({ children }: { children: React.ReactNode }) {
  const { scope } = useAnimationScope((scope) => {
    scope.createTimeline({
      '.page-content': {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        ease: easingFunctions.spring
      }
    });
  });

  return (
    <div className="page-content">
      {children}
    </div>
  );
}
```

### Loading States

```typescript
function LoadingSpinner() {
  const { scope } = useAnimationScope((scope) => {
    scope.createTimeline({
      '.spinner': {
        rotate: 360,
        duration: 1000,
        loop: true,
        ease: 'linear'
      }
    });
  });

  return <div className="spinner" />;
}
```

### Hover Interactions

```typescript
function InteractiveCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scope } = useAnimationScope((scope) => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener('mouseenter', () => {
      scope.createTimeline({
        target: card,
        scale: 1.05,
        translateY: -10,
        duration: 300,
        ease: easingFunctions.spring
      });
    });

    card.addEventListener('mouseleave', () => {
      scope.createTimeline({
        target: card,
        scale: 1,
        translateY: 0,
        duration: 300,
        ease: easingFunctions.spring
      });
    });
  });

  return (
    <div ref={cardRef} className="interactive-card">
      Card content
    </div>
  );
}
```

## Testing

### Testing with Motion Preferences

```typescript
// Mock motion preferences in tests
jest.mock('@/utils/animation.utils', () => ({
  shouldReduceMotion: jest.fn(() => false), // or true for reduced motion tests
  getMotionPreferences: jest.fn(() => ({
    prefersReducedMotion: false,
    motionLevel: 'full'
  }))
}));
```

### Testing Animation Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { useAnimationScope } from '@/hooks/use-animation.hooks';

test('should create animation scope', () => {
  const mockSetup = jest.fn();

  const { result } = renderHook(() =>
    useAnimationScope(mockSetup, { autoCleanup: false })
  );

  expect(mockSetup).toHaveBeenCalled();
  expect(result.current.scope).toBeDefined();
});
```

## Migration Guide

### From Custom Implementations

```typescript
// Before: Custom throttle/debounce
import { throttle } from './utils/throttle';

// After: es-toolkit
import { throttle } from 'es-toolkit';

// Before: Custom useMediaQuery
const useMediaQuery = (query: string) => { /* custom implementation */ };

// After: usehooks-ts
import { useMediaQuery } from 'usehooks-ts';
```

### From Direct AnimeJS Usage

```typescript
// Before: Direct AnimeJS
import { createScope } from 'animejs';

useEffect(() => {
  const scope = createScope({ root: document.body });
  // Manual cleanup required
  return () => scope.revert();
}, []);

// After: useAnimationScope
const { scope } = useAnimationScope((scope) => {
  // Automatic cleanup and motion preference handling
});
```

## Troubleshooting

### Common Issues

1. **Animations not running**: Check if `respectMotionPreference` is enabled and user has reduced motion preference
2. **Memory leaks**: Ensure `autoCleanup` is enabled or manual cleanup is called
3. **Performance issues**: Enable performance monitoring to identify bottlenecks
4. **Type errors**: Ensure all animation properties match the expected types

### Debug Mode

```typescript
// Enable debug mode for scroll animations
useScrollAnimation(
  containerRef,
  { debug: true }, // Shows scroll trigger markers
  animationSetup
);

// Performance monitoring
const config = {
  enablePerformanceMonitoring: true // Shows frame rates and dropped frames
};
```

## Contributing

When adding new animation features:

1. Add comprehensive TypeScript types
2. Include motion preference handling
3. Provide performance monitoring options
4. Add comprehensive tests
5. Update this documentation
6. Follow accessibility guidelines
