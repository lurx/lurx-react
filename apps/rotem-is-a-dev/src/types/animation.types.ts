import type { Scope } from 'animejs';

/**
 * Animation configuration for scroll-triggered animations
 */
export interface ScrollAnimationConfig {
	/** Target element selector or element */
	target: string | Element;
	/** Scroll position when animation should start (e.g., 'top bottom', 'center center') */
	enter: string;
	/** Scroll position when animation should end */
	leave: string;
	/** Sync value for scroll progress (0-1) */
	sync: number;
	/** Enable debug mode to visualize scroll triggers */
	debug?: boolean;
}

/**
 * Animation timing configuration
 */
export interface AnimationTiming {
	/** Animation duration in milliseconds */
	duration: number;
	/** Animation delay in milliseconds */
	delay?: number;
	/** Easing function */
	ease: string;
	/** Animation composition mode */
	composition?: 'replace' | 'add' | 'accumulate' | 'blend';
}

/**
 * Animation state for performance monitoring
 */
export interface AnimationState {
	/** Whether animation is currently running */
	isAnimating: boolean;
	/** Current animation progress (0-1) */
	progress: number;
	/** Animation performance metrics */
	performance: {
		frameRate: number;
		droppedFrames: number;
		startTime: number;
		endTime?: number;
	};
}

/**
 * Scroll progress data
 */
export interface ScrollProgress {
	/** Scroll progress between 0 and 1 */
	progress: number;
	/** Current scroll position */
	scrollY: number;
	/** Window height */
	windowHeight: number;
	/** Document height */
	documentHeight: number;
	/** Scroll direction */
	direction: 'up' | 'down';
}

/**
 * Animation scope reference for cleanup
 */
export interface AnimationScopeRef {
	scope: Nullable<Scope>;
	cleanup: () => void;
}

/**
 * Reduced motion preferences
 */
export interface MotionPreferences {
	/** User prefers reduced motion */
	prefersReducedMotion: boolean;
	/** Custom motion reduction level */
	motionLevel: 'none' | 'reduced' | 'full';
}

/**
 * Animation hook configuration
 */
export interface UseAnimationConfig {
	/** Enable/disable animations based on motion preferences */
	respectMotionPreference?: boolean;
	/** Animation timing defaults */
	defaultTiming?: Partial<AnimationTiming>;
	/** Enable performance monitoring */
	enablePerformanceMonitoring?: boolean;
	/** Auto-cleanup on unmount */
	autoCleanup?: boolean;
}

/**
 * Stagger animation configuration
 */
export interface StaggerConfig {
	/** Delay between each element animation */
	stagger: number;
	/** Stagger direction */
	direction?: 'normal' | 'reverse' | 'alternate';
	/** Grid dimensions for 2D stagger */
	grid?: [number, number];
	/** Stagger axis for grid */
	axis?: 'x' | 'y' | 'both';
}

/**
 * Intersection observer animation configuration
 */
export interface IntersectionAnimationConfig {
	/** Threshold for triggering animation (0-1) */
	threshold?: number;
	/** Root margin for intersection observer */
	rootMargin?: string;
	/** Whether to animate only once */
	once?: boolean;
	/** Whether to animate on exit */
	animateOnExit?: boolean;
}

/**
 * Animation properties for CSS transforms and styles
 */
export interface AnimationProperties {
	// Transform properties
	translateX?: number | string;
	translateY?: number | string;
	translateZ?: number | string;
	rotateX?: number | string;
	rotateY?: number | string;
	rotateZ?: number | string;
	scaleX?: number;
	scaleY?: number;
	scaleZ?: number;
	scale?: number;

	// CSS properties
	opacity?: number;
	width?: number | string;
	height?: number | string;
	backgroundColor?: string;
	color?: string;
	borderRadius?: number | string;

	// Custom properties
	[key: string]: number | string | undefined;
}

/**
 * Timeline animation step
 */
export interface TimelineStep {
	/** Target selector or element */
	target: string | Element;
	/** Animation properties */
	properties: AnimationProperties;
	/** Step timing */
	timing: AnimationTiming;
	/** Offset from previous step */
	offset?: number;
}

/**
 * Animation utility functions type
 */
export interface AnimationUtils {
	/** Create scoped animation instance */
	createScope: (root?: Element) => Scope;
	/** Cleanup all animations */
	cleanup: () => void;
	/** Get animation performance metrics */
	getPerformanceMetrics: () => AnimationState['performance'];
	/** Check if animations should be reduced */
	shouldReduceMotion: () => boolean;
}
