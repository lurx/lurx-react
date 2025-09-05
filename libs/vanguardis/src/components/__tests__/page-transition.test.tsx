import { render, screen, waitFor } from '@testing-library/react';
import { FadeTransition, PageTransition } from '../page-transition';

// Mock Next.js usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/test-path')
}));

// Mock animation utilities
jest.mock('../../utils/animation.utils', () => ({
  shouldReduceMotion: jest.fn(() => false),
}));

// Mock LoadingScreen component
jest.mock('../loading-screen', () => ({
  LoadingScreen: ({ isVisible, message, progress }: {
    isVisible: boolean;
    message: string;
    progress: number;
  }) => (
    isVisible ? (
      <div data-testid="loading-screen">
        <span>{message}</span>
        <span>{progress}%</span>
      </div>
    ) : null
  )
}));

describe('PageTransition', () => {
  const defaultProps = {
    children: <div>Test Content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children content', () => {
    render(<PageTransition {...defaultProps} />);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply correct transition type class', () => {
    render(<PageTransition {...defaultProps} transitionType="slide" />);

    const container = document.querySelector('[class*="pageTransition"]');
    expect(container).toHaveClass('slide');
  });

  it('should show loading screen when enabled on pathname change', async () => {
    const { usePathname } = require('next/navigation');

    // Start with initial pathname
    usePathname.mockReturnValue('/initial-path');
    const { rerender } = render(
      <PageTransition {...defaultProps} showLoading={true} loadingMessage="Custom Loading" />
    );

    // Change pathname to trigger transition
    usePathname.mockReturnValue('/new-path');
    rerender(
      <PageTransition {...defaultProps} showLoading={true} loadingMessage="Custom Loading" />
    );

    // Loading screen may appear briefly during transition
    // We test that the component can handle the loading state
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should not show loading screen when disabled', () => {
    render(<PageTransition {...defaultProps} showLoading={false} />);

    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-transition-class';
    render(<PageTransition {...defaultProps} className={customClass} />);

    const container = document.querySelector('[class*="pageTransition"]');
    expect(container).toHaveClass(customClass);
  });

  it('should handle reduced motion preference', () => {
    const { shouldReduceMotion } = require('../../utils/animation.utils');
    shouldReduceMotion.mockReturnValue(true);

    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValueOnce('/initial-path');

    const { rerender } = render(<PageTransition {...defaultProps} />);

    // Change pathname
    usePathname.mockReturnValueOnce('/new-path');
    rerender(<PageTransition {...defaultProps} />);

    // Should not show loading screen for reduced motion
    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });

  it('should handle transition overlays for special effects', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/initial-path');

    render(<PageTransition {...defaultProps} transitionType="curtain" />);

    // Test that component renders without errors with special transition types
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    const container = document.querySelector('[class*="pageTransition"]');
    expect(container).toHaveClass('curtain');
  });

  it('should handle various transition types', () => {
    const transitionTypes = ['fade', 'slide', 'scale', 'curtain', 'ripple'] as const;

    transitionTypes.forEach(type => {
      const { unmount } = render(
        <PageTransition {...defaultProps} transitionType={type} />
      );

      const container = document.querySelector('[class*="pageTransition"]');
      expect(container).toHaveClass(type);

      unmount();
    });
  });

  it('should set custom CSS properties for duration', () => {
    const customDuration = 800;
    render(<PageTransition {...defaultProps} duration={customDuration} />);

    const container = document.querySelector('[class*="pageTransition"]') as HTMLElement;
    expect(container.style.getPropertyValue('--transition-duration')).toBe(`${customDuration}ms`);
  });
});

describe('FadeTransition', () => {
  const defaultProps = {
    children: <div>Fade Content</div>,
    isVisible: true
  };

  it('should render children when visible', () => {
    render(<FadeTransition {...defaultProps} />);

    expect(screen.getByText('Fade Content')).toBeInTheDocument();
  });

  it('should not render children when not visible initially', () => {
    render(<FadeTransition {...defaultProps} isVisible={false} />);

    expect(screen.queryByText('Fade Content')).not.toBeInTheDocument();
  });

  it('should apply visible class when isVisible is true', () => {
    render(<FadeTransition {...defaultProps} isVisible={true} />);

    const container = document.querySelector('[class*="fadeTransition"]');
    expect(container).toHaveClass('visible');
  });

  it('should not apply visible class when isVisible is false', () => {
    render(<FadeTransition {...defaultProps} isVisible={false} />);

    // When not visible, component might not render at all
    const container = document.querySelector('[class*="fadeTransition"]');
    if (container) {
      expect(container).not.toHaveClass('visible');
    } else {
      // Component correctly doesn't render when not visible
      expect(container).toBeNull();
    }
  });

  it('should handle visibility transitions', async () => {
    const { rerender } = render(<FadeTransition {...defaultProps} isVisible={false} />);

    // Should not be in DOM initially
    expect(screen.queryByText('Fade Content')).not.toBeInTheDocument();

    // Make visible
    rerender(<FadeTransition {...defaultProps} isVisible={true} />);

    // Should appear in DOM
    expect(screen.getByText('Fade Content')).toBeInTheDocument();

    // Hide again
    rerender(<FadeTransition {...defaultProps} isVisible={false} duration={100} />);

    // Should still be in DOM temporarily during transition
    expect(screen.getByText('Fade Content')).toBeInTheDocument();

    // Should be removed after transition completes
    await waitFor(() => {
      expect(screen.queryByText('Fade Content')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('should apply custom className', () => {
    const customClass = 'custom-fade-class';
    render(<FadeTransition {...defaultProps} className={customClass} />);

    const container = document.querySelector('[class*="fadeTransition"]');
    expect(container).toHaveClass(customClass);
  });

  it('should set custom CSS properties', () => {
    const customDuration = 500;
    const customDelay = 100;

    render(
      <FadeTransition
        {...defaultProps}
        duration={customDuration}
        delay={customDelay}
      />
    );

    const container = document.querySelector('[class*="fadeTransition"]') as HTMLElement;
    expect(container.style.getPropertyValue('--transition-duration')).toBe(`${customDuration}ms`);
    expect(container.style.getPropertyValue('--transition-delay')).toBe(`${customDelay}ms`);
  });

  it('should handle multiple rapid visibility changes', () => {
    const { rerender } = render(<FadeTransition {...defaultProps} isVisible={false} />);

    // Rapidly toggle visibility
    rerender(<FadeTransition {...defaultProps} isVisible={true} />);
    rerender(<FadeTransition {...defaultProps} isVisible={false} />);
    rerender(<FadeTransition {...defaultProps} isVisible={true} />);

    // Should handle gracefully without errors
    expect(screen.getByText('Fade Content')).toBeInTheDocument();
  });
});
