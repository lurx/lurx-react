import { createScope } from 'animejs';
import type {
	AnimationState,
	AnimationUtils,
	MotionPreferences,
} from '../types/animation.types';

/**
 * Global animation performance tracking
 */
class AnimationPerformanceMonitor {
	private animations = new Set<string>();
	private frameCount = 0;
	private droppedFrames = 0;
	private lastFrameTime = 0;
	private isMonitoring = false;

	startMonitoring(animationId: string): void {
		this.animations.add(animationId);
		if (!this.isMonitoring) {
			this.isMonitoring = true;
			this.monitorFrames();
		}
	}

	stopMonitoring(animationId: string): void {
		this.animations.delete(animationId);
		if (this.animations.size === 0) {
			this.isMonitoring = false;
		}
	}

	private monitorFrames(): void {
		if (!this.isMonitoring) return;

		const currentTime = performance.now();

		if (this.lastFrameTime > 0) {
			const deltaTime = currentTime - this.lastFrameTime;
			const targetFrameTime = 1000 / 60; // 60fps

			if (deltaTime > targetFrameTime * 1.5) {
				this.droppedFrames++;
			}
		}

		this.frameCount++;
		this.lastFrameTime = currentTime;

		if (this.isMonitoring) {
			requestAnimationFrame(() => this.monitorFrames());
		}
	}

	getMetrics(): AnimationState['performance'] {
		const now = performance.now();
		const frameRate =
			this.frameCount > 0 ? 1000 / (now - this.lastFrameTime || 1) : 0;

		return {
			frameRate: Math.round(frameRate),
			droppedFrames: this.droppedFrames,
			startTime: this.lastFrameTime,
		};
	}

	reset(): void {
		this.frameCount = 0;
		this.droppedFrames = 0;
		this.lastFrameTime = 0;
	}
}

/**
 * Global performance monitor instance
 */
const performanceMonitor = new AnimationPerformanceMonitor();

/**
 * Get user's motion preferences from system settings and localStorage
 *
 * Checks both the system-level prefers-reduced-motion setting and any
 * custom preference stored in localStorage.
 *
 * @returns MotionPreferences object with current settings
 *
 * @example
 * ```typescript
 * const preferences = getMotionPreferences();
 * if (preferences.prefersReducedMotion) {
 *   // Use reduced motion animations
 * }
 * ```
 */
export function getMotionPreferences(): MotionPreferences {
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	// Check for custom motion level in localStorage or other preference system
	const customMotionLevel = localStorage.getItem('motion-preference') as
		| MotionPreferences['motionLevel']
		| null;

	return {
		prefersReducedMotion,
		motionLevel:
			customMotionLevel || (prefersReducedMotion ? 'reduced' : 'full'),
	};
}

/**
 * Set custom motion preference in localStorage
 *
 * Stores the user's motion preference and dispatches a custom event
 * to notify other components of the change.
 *
 * @param level - Motion level: 'none', 'reduced', or 'full'
 *
 * @example
 * ```typescript
 * setMotionPreference('reduced'); // Reduce motion for this user
 * setMotionPreference('full');    // Enable full motion
 * ```
 */
export function setMotionPreference(
	level: MotionPreferences['motionLevel'],
): void {
	localStorage.setItem('motion-preference', level);

	// Dispatch custom event for other components to listen to
	window.dispatchEvent(
		new CustomEvent('motion-preference-changed', {
			detail: { motionLevel: level },
		}),
	);
}

/**
 * Check if animations should be reduced based on user preferences
 *
 * Combines system-level motion preferences with custom user settings
 * to determine if animations should be disabled or reduced.
 *
 * @returns true if motion should be reduced or disabled
 *
 * @example
 * ```typescript
 * if (shouldReduceMotion()) {
 *   // Skip complex animations
 *   element.style.opacity = '1';
 * } else {
 *   // Run full animation
 *   animateElement(element);
 * }
 * ```
 */
export function shouldReduceMotion(): boolean {
	const preferences = getMotionPreferences();
	return preferences.motionLevel === 'none' || preferences.prefersReducedMotion;
}

/**
 * Pre-defined easing functions optimized for web animations
 *
 * Cubic-bezier curves tuned for smooth, natural motion that works
 * well across different animation types and durations.
 */
export const easingFunctions = {
	// Standard easing
	ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
	easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
	easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
	easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',

	// Custom easing for different effects
	spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
	bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
	elastic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

	// Performance-optimized
	linear: 'linear',
	smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
} as const;

/**
 * Calculate animation duration based on motion preferences
 *
 * Automatically adjusts animation duration based on user's motion
 * preferences. Returns 0 for 'none', 50% duration for 'reduced',
 * and full duration for 'full'.
 *
 * @param baseMs - Base animation duration in milliseconds
 * @returns Adjusted duration based on motion preferences
 *
 * @example
 * ```typescript
 * const duration = getAnimationDuration(800); // Returns 800ms for full motion
 * const reducedDuration = getAnimationDuration(800); // Returns 400ms for reduced motion
 * ```
 */
export function getAnimationDuration(baseMs: number): number {
	const preferences = getMotionPreferences();

	switch (preferences.motionLevel) {
		case 'none':
			return 0;
		case 'reduced':
			return Math.min(baseMs * 0.5, 200); // Max 200ms for reduced motion
		case 'full':
		default:
			return baseMs;
	}
}

/**
 * Create scoped animation utilities
 */
export function createAnimationUtils(rootElement?: Element): AnimationUtils {
	const activeScopes = new Set<ReturnType<typeof createScope>>();

	return {
		createScope: (root?: Element) => {
			const scope = createScope({ root: root as HTMLElement });
			activeScopes.add(scope);
			return scope;
		},

		cleanup: () => {
			activeScopes.forEach(scope => {
				try {
					scope.revert();
				} catch (error) {
					console.warn('Error cleaning up animation scope:', error);
				}
			});
			activeScopes.clear();
		},

		getPerformanceMetrics: () => performanceMonitor.getMetrics(),

		shouldReduceMotion,
	};
}

/**
 * Start performance monitoring for an animation
 */
export function startAnimationMonitoring(animationId: string): void {
	performanceMonitor.startMonitoring(animationId);
}

/**
 * Stop performance monitoring for an animation
 */
export function stopAnimationMonitoring(animationId: string): void {
	performanceMonitor.stopMonitoring(animationId);
}
