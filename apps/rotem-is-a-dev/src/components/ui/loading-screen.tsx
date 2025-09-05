'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { shouldReduceMotion } from '../../utils/animation.utils';
import styles from './loading-screen.module.scss';

/**
 * Loading Screen Types
 */
export interface LoadingScreenProps {
  /** The loading message to display */
  message?: string;
  /** Loading progress (0-100) */
  progress?: number;
  /** Whether to show the progress bar */
  showProgress?: boolean;
  /** Loading screen variant */
  variant?: 'default' | 'minimal' | 'brand';
  /** Custom class name for styling */
  className?: string;
  /** Whether the loading screen is visible */
  isVisible: boolean;
  /** Callback when loading animation completes */
  onComplete?: () => void;
}

/**
 * LoadingScreen Component
 *
 * A beautiful, animated loading screen that showcases our design system
 * and animation utilities. Features smooth transitions, progress tracking,
 * and multiple variants for different use cases.
 */
export const LoadingScreen = memo<LoadingScreenProps>(({
  message = 'Loading...',
  progress = 0,
  showProgress = true,
  variant = 'default',
  className = '',
  isVisible,
  onComplete
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
      // Wait for exit animation to complete
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
        onComplete?.();
      }, shouldReduceMotion() ? 0 : 600);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, shouldRender, onComplete]);

  // Update progress bar
  useEffect(() => {
    if (!progressRef.current || !showProgress) return;

    const progressBar = progressRef.current;
    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  }, [progress, showProgress]);

  if (!shouldRender) {
    return null;
  }

  const screenClasses = [
    styles.loadingScreen,
    styles[variant],
    isVisible && !isExiting ? styles.visible : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={screenClasses}
      role="dialog"
      aria-label="Loading content"
      aria-live="polite"
    >
      <div className={styles.content}>
        {/* Brand Logo/Icon */}
        <div className={styles.brandIcon}>
          <div className={styles.iconInner}>
            <span className={styles.iconText}>R</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className={styles.loadingAnimation}>
          <div className={styles.loadingDot} />
          <div className={styles.loadingDot} />
          <div className={styles.loadingDot} />
        </div>

        {/* Loading Message */}
        <p className={styles.loadingMessage}>{message}</p>

        {/* Progress Bar */}
        {showProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressTrack}>
              <div ref={progressRef} className={styles.progressFill} />
            </div>
            <span className={styles.progressText} aria-live="polite">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Background Pattern */}
      <div className={styles.backgroundPattern} aria-hidden="true" />
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

/**
 * Simple Loading Spinner Component
 * For use in smaller UI elements
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'accent';
  /** Custom class name */
  className?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const spinnerClasses = [
    styles.loadingSpinner,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-label="Loading"
    >
      <div className={styles.spinnerRing} />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
