import type { Scope } from 'animejs';
import { createScope } from 'animejs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import type {
  AnimationScopeRef,
  AnimationState,
  MotionPreferences,
  UseAnimationConfig
} from '../types/animation.types';
import type { Nullable } from '../types/design-system.types';
import {
  shouldReduceMotion,
  startAnimationMonitoring,
  stopAnimationMonitoring
} from '../utils/animation.utils';

/**
 * Hook for managing AnimeJS scoped animations with automatic cleanup
 */
export function useAnimationScope(
	animationSetup: (scope: Scope) => void,
	config: UseAnimationConfig = {}
): AnimationScopeRef {
	const {
		respectMotionPreference = true,
		autoCleanup = true,
		enablePerformanceMonitoring = false
	} = config;

	const scopeRef = useRef<Nullable<Scope>>(null);
	const animationIdRef = useRef<string | undefined>(undefined);
	const setupRef = useRef(animationSetup);
	const [scope, setScope] = useState<Nullable<Scope>>(null);

	// Update setup ref when function changes
	setupRef.current = animationSetup;

	const cleanup = useCallback(() => {
		if (scopeRef.current) {
			try {
				scopeRef.current.revert();
			} catch (error) {
				console.warn('Error cleaning up animation scope:', error);
			}
			scopeRef.current = null;
			setScope(null);
		}

		if (animationIdRef.current && enablePerformanceMonitoring) {
			stopAnimationMonitoring(animationIdRef.current);
		}
	}, [enablePerformanceMonitoring]);

	useEffect(() => {
		// Check motion preferences
		if (respectMotionPreference && shouldReduceMotion()) {
			return;
		}

		// Create unique animation ID for monitoring
		if (enablePerformanceMonitoring) {
			animationIdRef.current = `animation-${Date.now()}-${Math.random()}`;
			startAnimationMonitoring(animationIdRef.current);
		}

		// Create animation scope
		const newScope = createScope({ root: document.body });
		scopeRef.current = newScope;
		setScope(newScope);

		// Set up animations
		try {
			setupRef.current(newScope);
		} catch (error) {
			console.error('Error setting up animations:', error);
			// Inline cleanup on error
			if (scopeRef.current) {
				try {
					scopeRef.current.revert();
				} catch (cleanupError) {
					console.warn('Error cleaning up animation scope:', cleanupError);
				}
				scopeRef.current = null;
				setScope(null);
			}
			if (animationIdRef.current && enablePerformanceMonitoring) {
				stopAnimationMonitoring(animationIdRef.current);
			}
			return;
		}

		// Return cleanup function if autoCleanup is enabled
		if (autoCleanup) {
			return () => {
				if (scopeRef.current) {
					try {
						scopeRef.current.revert();
					} catch (cleanupError) {
						console.warn('Error cleaning up animation scope:', cleanupError);
					}
					scopeRef.current = null;
					setScope(null);
				}
				if (animationIdRef.current && enablePerformanceMonitoring) {
					stopAnimationMonitoring(animationIdRef.current);
				}
			};
		}
	}, [respectMotionPreference, autoCleanup, enablePerformanceMonitoring]);

	return {
		scope,
		cleanup
	};
}

/**
 * Hook for motion preferences with live updates using usehooks-ts
 */
export function useMotionPreferences(): MotionPreferences {
	const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
	const [customMotionLevel, setCustomMotionLevel] = useLocalStorage<MotionPreferences['motionLevel'] | null>(
		'motion-preference',
		null
	);

	const motionLevel = customMotionLevel || (prefersReducedMotion ? 'reduced' : 'full');

	useEffect(() => {
		// Dispatch custom event when preferences change
		window.dispatchEvent(new CustomEvent('motion-preference-changed', {
			detail: { motionLevel }
		}));
	}, [motionLevel]);

	return {
		prefersReducedMotion,
		motionLevel,
		setMotionLevel: setCustomMotionLevel,
	} as MotionPreferences & { setMotionLevel: (level: MotionPreferences['motionLevel']) => void };
}

/**
 * Hook for tracking animation state and performance
 */
export function useAnimationState(
	animationId?: string,
	enableMonitoring = false
): AnimationState {
	const [state, setState] = useState<AnimationState>({
		isAnimating: false,
		progress: 0,
		performance: {
			frameRate: 0,
			droppedFrames: 0,
			startTime: 0,
		}
	});

	useEffect(() => {
		if (!enableMonitoring || !animationId) return;

		let rafId: number;
		let startTime = performance.now();

		const updateState = () => {
			const currentTime = performance.now();                        setState((prevState: AnimationState) => ({
				...prevState,
				performance: {
					...prevState.performance,
					frameRate: Math.round(1000 / (currentTime - startTime)),
					startTime,
				}
			}));

			startTime = currentTime;
			rafId = requestAnimationFrame(updateState);
		};

		if (state.isAnimating) {
			rafId = requestAnimationFrame(updateState);
		}

		return () => {
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [animationId, enableMonitoring, state.isAnimating]);

	const startAnimation = useCallback(() => {                setState((prev: AnimationState) => ({ ...prev, isAnimating: true, progress: 0 }));
		if (animationId && enableMonitoring) {
			startAnimationMonitoring(animationId);
		}
	}, [animationId, enableMonitoring]);

	const stopAnimation = useCallback(() => {                setState((prev: AnimationState) => ({ ...prev, isAnimating: false, progress: 1 }));
		if (animationId && enableMonitoring) {
			stopAnimationMonitoring(animationId);
		}
	}, [animationId, enableMonitoring]);

	const updateProgress = useCallback((progress: number) => {                setState((prev: AnimationState) => ({ ...prev, progress: Math.max(0, Math.min(1, progress)) }));
	}, []);

	return {
		...state,
		startAnimation,
		stopAnimation,
		updateProgress,
	} as AnimationState & {
		startAnimation: () => void;
		stopAnimation: () => void;
		updateProgress: (progress: number) => void;
	};
}

/**
 * Hook for managing multiple animation scopes
 */
export function useMultipleAnimationScopes(): {
	createScope: (id: string, setup: (scope: Scope) => void) => void;
	removeScope: (id: string) => void;
	cleanupAll: () => void;
	scopes: Map<string, Scope>;
} {
	const scopesRef = useRef(new Map<string, Scope>());

	const createAnimationScope = useCallback((id: string, setup: (scope: Scope) => void) => {
		// Check motion preferences
		if (shouldReduceMotion()) {
			return;
		}

		// Clean up existing scope with same ID
		const existingScope = scopesRef.current.get(id);
		if (existingScope) {
			try {
				existingScope.revert();
			} catch (error) {
				console.warn(`Error cleaning up existing scope ${id}:`, error);
			}
		}

		// Create new scope
		const newScope = createScope({ root: document.body });
		scopesRef.current.set(id, newScope);

		try {
			setup(newScope);
		} catch (error) {
			console.error(`Error setting up animation scope ${id}:`, error);
			scopesRef.current.delete(id);
		}
	}, []);

	const removeScope = useCallback((id: string) => {
		const scope = scopesRef.current.get(id);
		if (scope) {
			try {
				scope.revert();
			} catch (error) {
				console.warn(`Error removing scope ${id}:`, error);
			}
			scopesRef.current.delete(id);
		}
	}, []);

	const cleanupAll = useCallback(() => {
		scopesRef.current.forEach((scope, id) => {
			try {
				scope.revert();
			} catch (error) {
				console.warn(`Error cleaning up scope ${id}:`, error);
			}
		});
		scopesRef.current.clear();
	}, []);

	useEffect(() => {
		// Cleanup all scopes on unmount
		return cleanupAll;
	}, [cleanupAll]);

	return {
		createScope: createAnimationScope,
		removeScope,
		cleanupAll,
		scopes: scopesRef.current,
	};
}
