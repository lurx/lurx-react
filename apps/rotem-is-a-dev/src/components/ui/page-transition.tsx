'use client';

import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import { shouldReduceMotion } from '../../utils/animation.utils';
import { LoadingScreen } from './loading-screen';
import styles from './page-transition.module.scss';

/**
 * Page transition types
 */
export type TransitionType = 'fade' | 'slide' | 'scale' | 'curtain' | 'ripple';

export interface PageTransitionProps {
  /** Children to render */
  children: React.ReactNode;
  /** Type of transition animation */
  transitionType?: TransitionType;
  /** Transition duration in milliseconds */
  duration?: number;
  /** Whether to show loading screen during transition */
  showLoading?: boolean;
  /** Custom loading message */
  loadingMessage?: string;
  /** Custom class name */
  className?: string;
}

/**
 * PageTransition Component
 *
 * Provides smooth page transitions with loading screens.
 * Integrates with Next.js routing and uses our design system.
 */
export const PageTransition = memo<PageTransitionProps>(({
  children,
  transitionType = 'fade',
  duration = 600,
  showLoading = true,
  loadingMessage = 'Loading...',
  className = ''
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle route changes
  useEffect(() => {
    // Skip transition on first load
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      setDisplayChildren(children);
      return;
    }

    // Skip if pathname hasn't changed
    if (previousPathnameRef.current === pathname) {
      setDisplayChildren(children);
      return;
    }

    // Start transition
    const startTransition = () => {
      if (shouldReduceMotion()) {
        // Skip animation for reduced motion
        setDisplayChildren(children);
        previousPathnameRef.current = pathname;
        return;
      }

      setIsTransitioning(true);
      setProgress(0);

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 30;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 50);

      // Complete transition after duration
      transitionTimeoutRef.current = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);

        // Small delay to show 100% progress
        setTimeout(() => {
          setDisplayChildren(children);
          setIsTransitioning(false);
          setProgress(0);
          previousPathnameRef.current = pathname;
        }, 100);
      }, duration * 0.7); // Complete transition before full duration
    };

    startTransition();

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [pathname, children, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const containerClasses = [
    styles.pageTransition,
    styles[transitionType],
    isTransitioning ? styles.transitioning : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Loading screen overlay */}
      {showLoading && (
        <LoadingScreen
          isVisible={isTransitioning}
          message={loadingMessage}
          progress={progress}
          showProgress={true}
          variant="default"
          onComplete={() => {
            // Additional cleanup if needed
          }}
        />
      )}

      {/* Main content container */}
      <div
        ref={containerRef}
        className={containerClasses}
        style={{
          '--transition-duration': `${duration}ms`
        } as React.CSSProperties}
      >
        <div className={styles.content}>
          {displayChildren}
        </div>

        {/* Transition overlay for special effects */}
        {isTransitioning && (
          <div className={styles.transitionOverlay} aria-hidden="true">
            {transitionType === 'curtain' && (
              <>
                <div className={styles.curtainLeft} />
                <div className={styles.curtainRight} />
              </>
            )}
            {transitionType === 'ripple' && (
              <div className={styles.rippleEffect} />
            )}
          </div>
        )}
      </div>
    </>
  );
});

PageTransition.displayName = 'PageTransition';

/**
 * Simpler transition wrapper for individual components
 */
export interface FadeTransitionProps {
  /** Children to animate */
  children: React.ReactNode;
  /** Whether the children should be visible */
  isVisible: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Custom class name */
  className?: string;
}

export const FadeTransition = memo<FadeTransitionProps>(({
  children,
  isVisible,
  duration = 300,
  delay = 0,
  className = ''
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, duration]);

  if (!shouldRender) {
    return null;
  }

  const fadeClasses = [
    styles.fadeTransition,
    isVisible ? styles.visible : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={fadeClasses}
      style={{
        '--transition-duration': `${duration}ms`,
        '--transition-delay': `${delay}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
});

FadeTransition.displayName = 'FadeTransition';
