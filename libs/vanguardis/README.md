# 🎨 Vanguardis Design System

> A modern, comprehensive design system library for React applications

Vanguardis is a cutting-edge design system that provides a complete foundation for building beautiful, accessible, and performant user interfaces. Named after the French word for "avant-garde," Vanguardis embodies innovation and forward-thinking design principles.

## ✨ Features

- **🎨 Complete Design Tokens**: Comprehensive color palettes, typography, spacing, and animation tokens
- **🧩 Modular Components**: Reusable, accessible UI components built with React 18
- **🎭 Advanced Animations**: Smooth, performant animations using AnimeJS
- **♿ Accessibility First**: WCAG 2.1 AA compliance by default
- **📱 Responsive Design**: Mobile-first approach with fluid typography
- **🎯 TypeScript Support**: Fully typed with comprehensive TypeScript definitions
- **🎪 Modern Effects**: Glassmorphism, neumorphism, and gradient effects
- **⚡ Performance Optimized**: Minimal bundle size with tree-shaking support
- **🎁 VanguardisProvider**: Easy setup with automatic CSS loading

## 🚀 Quick Start

### Installation & Setup

The easiest way to get started with Vanguardis is to use the `VanguardisProvider` component, which automatically loads all the necessary CSS and design tokens:

```tsx
import { VanguardisProvider } from '@lurx-react/vanguardis';

function App({ children }) {
  return (
    <VanguardisProvider>
      {children}
    </VanguardisProvider>
  );
}
```

### Basic Usage

```tsx
import { LoadingScreen, FadeIn } from '@lurx-react/vanguardis';
import '@lurx-react/vanguardis/styles/design-tokens.scss';
import '@lurx-react/vanguardis/styles/utilities.scss';

function App() {
  return (
    <div>
      <FadeIn>
        <h1 className="heading-1">Welcome to Vanguardis</h1>
      </FadeIn>

      <LoadingScreen
        isVisible={isLoading}
        message="Loading your amazing app..."
        variant="brand"
        showProgress={true}
      />
    </div>
  );
}
```

### Using Components

```tsx
import { LoadingScreen, FadeIn, SlideIn } from '@lurx-react/vanguardis';
```

## 🧩 Components

### Core UI Components

- **LoadingScreen**: Beautiful loading screens with multiple variants
- **PageTransition**: Smooth page transitions with multiple effects

### Animation Components

- **FadeIn**: Smooth fade entrance animations
- **SlideIn**: Slide animations from any direction
- **ScaleIn**: Scale entrance animations
- **StaggerFadeIn**: Staggered animations for multiple elements

## 🎨 Design Tokens

Complete set of design tokens including:

- **Colors**: Primary, accent, secondary, and neutral palettes
- **Typography**: Fluid font scales and semantic text styles
- **Spacing**: 4px-based spacing system
- **Shadows**: Multiple shadow variants including glows
- **Border Radius**: Consistent border radius scale
- **Animations**: Duration and easing tokens

## 📱 Responsive Design

All components are built mobile-first with responsive breakpoints:

- **xs**: 475px (extra small phones)
- **sm**: 640px (small phones)
- **md**: 768px (tablets)
- **lg**: 1024px (small laptops)
- **xl**: 1280px (laptops)
- **2xl**: 1536px (large screens)

## ♿ Accessibility

Vanguardis prioritizes accessibility:

- **WCAG 2.1 AA compliance** by default
- **Proper ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** optimization
- **Reduced motion** preferences respected

## 🧪 Testing

Run `nx test vanguardis` to execute the unit tests via [Vitest](https://vitest.dev/).

---

Built with ❤️ for modern React applications
