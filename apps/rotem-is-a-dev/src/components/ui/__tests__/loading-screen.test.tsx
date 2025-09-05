import { render, screen, waitFor } from '@testing-library/react';
import { LoadingScreen, LoadingSpinner } from '../loading-screen';

// Mock animation utilities
jest.mock('../../../utils/animation.utils', () => ({
  shouldReduceMotion: jest.fn(() => false),
}));

describe('LoadingScreen', () => {
  const defaultProps = {
    isVisible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading screen when visible', () => {
    render(<LoadingScreen {...defaultProps} />);

    expect(screen.getByRole('dialog', { name: /loading content/i })).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(<LoadingScreen {...defaultProps} isVisible={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should display custom message', () => {
    const customMessage = 'Custom loading message';
    render(<LoadingScreen {...defaultProps} message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should show progress bar when enabled', () => {
    render(<LoadingScreen {...defaultProps} showProgress={true} progress={75} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should not show progress bar when disabled', () => {
    render(<LoadingScreen {...defaultProps} showProgress={false} />);

    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('should apply correct variant class', () => {
    render(<LoadingScreen {...defaultProps} variant="brand" />);

    const container = screen.getByRole('dialog');
    expect(container).toHaveClass('brand');
  });

  it('should call onComplete when transitioning out', async () => {
    const onComplete = jest.fn();
    const { rerender } = render(
      <LoadingScreen {...defaultProps} onComplete={onComplete} />
    );

    // Hide the loading screen
    rerender(
      <LoadingScreen {...defaultProps} isVisible={false} onComplete={onComplete} />
    );

    // Wait for the transition to complete
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should render brand icon with correct text', () => {
    render(<LoadingScreen {...defaultProps} />);

    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('should render loading dots', () => {
    render(<LoadingScreen {...defaultProps} />);

    // Should have 3 loading dots
    const container = screen.getByRole('dialog');
    const dots = container.querySelectorAll('[class*="loadingDot"]');
    expect(dots).toHaveLength(3);
  });

  it('should handle progress bounds correctly', () => {
    // Test negative progress
    const { rerender } = render(
      <LoadingScreen {...defaultProps} showProgress={true} progress={-10} />
    );
    expect(screen.getByText('-10%')).toBeInTheDocument(); // Component shows actual progress value

    // Test progress over 100
    rerender(
      <LoadingScreen {...defaultProps} showProgress={true} progress={150} />
    );
    expect(screen.getByText('150%')).toBeInTheDocument(); // Component shows actual progress value
  });

  it('should apply custom className', () => {
    const customClass = 'custom-loading-class';
    render(<LoadingScreen {...defaultProps} className={customClass} />);

    const container = screen.getByRole('dialog');
    expect(container).toHaveClass(customClass);
  });
});

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('md', 'primary');
  });

  it('should apply size classes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(size);
      unmount();
    });
  });

  it('should apply variant classes correctly', () => {
    const variants = ['primary', 'secondary', 'accent'] as const;

    variants.forEach(variant => {
      const { unmount } = render(<LoadingSpinner variant={variant} />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(variant);
      unmount();
    });
  });

  it('should apply custom className', () => {
    const customClass = 'custom-spinner-class';
    render(<LoadingSpinner className={customClass} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(customClass);
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
  });

  it('should render spinner ring element', () => {
    render(<LoadingSpinner />);

    const container = screen.getByRole('status');
    const ring = container.querySelector('[class*="spinnerRing"]');
    expect(ring).toBeInTheDocument();
  });
});
