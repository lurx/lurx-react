import { onScroll } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import type {
	IntersectionAnimationConfig,
	ScrollAnimationConfig,
	ScrollProgress,
} from '../types/animation.types';
import { shouldReduceMotion } from '../utils/animation.utils';
import { debounce, throttle } from 'es-toolkit';

/**
 * Hook for tracking scroll progress and direction
 */
export function useScrollProgress(): ScrollProgress {
	const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
		progress: 0,
		scrollY: 0,
		windowHeight: 0,
		documentHeight: 0,
		direction: 'down',
	});

	const lastScrollY = useRef(0);

	useEffect(() => {
		const updateScrollProgress = throttle(() => {
			const scrollY = window.pageYOffset;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const maxScroll = documentHeight - windowHeight;
			const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
			const direction = scrollY > lastScrollY.current ? 'down' : 'up';

			setScrollProgress({
				progress,
				scrollY,
				windowHeight,
				documentHeight,
				direction,
			});

			lastScrollY.current = scrollY;
		}, 16); // ~60fps throttling

		// Initial calculation
		updateScrollProgress();

		window.addEventListener('scroll', updateScrollProgress, { passive: true });
		window.addEventListener('resize', debounce(updateScrollProgress, 250));

		return () => {
			window.removeEventListener('scroll', updateScrollProgress);
			window.removeEventListener('resize', updateScrollProgress);
		};
	}, []);

	return scrollProgress;
}

/**
 * Hook for scroll-triggered animations using AnimeJS onScroll
 */
export function useScrollAnimation(
	config: ScrollAnimationConfig,
	dependencies: React.DependencyList = [],
): {
	isActive: boolean;
	progress: number;
} {
	const [isActive, setIsActive] = useState(false);
	const [progress, setProgress] = useState(0);
	const cleanupRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		// Skip if motion should be reduced
		if (shouldReduceMotion()) {
			return;
		}

		// Clean up previous animation
		if (cleanupRef.current) {
			cleanupRef.current();
			cleanupRef.current = null;
		}

		try {
			// Create scroll-triggered animation
			onScroll({
				target: config.target,
				enter: config.enter,
				leave: config.leave,
				sync: config.sync,
				debug: config.debug || false,
			});

			// Set up manual tracking for enter/leave/progress
			const handleScroll = throttle(() => {
				// This is a simplified implementation - you may need to adjust based on AnimeJS API
				// The actual implementation would depend on how onScroll works in your version
				const element =
					typeof config.target === 'string'
						? document.querySelector(config.target)
						: config.target;

				if (element) {
					const rect = element.getBoundingClientRect();
					const isInView = rect.top < window.innerHeight && rect.bottom > 0;

					setIsActive(isInView);

					if (isInView) {
						const progress = Math.max(
							0,
							Math.min(
								1,
								(window.innerHeight - rect.top) /
									(window.innerHeight + rect.height),
							),
						);
						setProgress(progress);
					}
				}
			}, 16);

			window.addEventListener('scroll', handleScroll, { passive: true });
			handleScroll(); // Initial calculation

			cleanupRef.current = () => {
				window.removeEventListener('scroll', handleScroll);
			};
		} catch (error) {
			console.error('Error creating scroll animation:', error);
		}

		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
			}
		};
	}, [
		config.target,
		config.enter,
		config.leave,
		config.sync,
		config.debug,
		dependencies,
	]);

	return { isActive, progress };
}

/**
 * Hook for intersection observer based animations
 */
export function useIntersectionAnimation(
	config: IntersectionAnimationConfig = {},
	onIntersect?: (
		isIntersecting: boolean,
		entry: IntersectionObserverEntry,
	) => void,
): {
	ref: React.RefObject<HTMLElement | null>;
	isIntersecting: boolean;
	hasIntersected: boolean;
} {
	const {
		threshold = 0.1,
		rootMargin = '0px',
		once = true,
		animateOnExit = false,
	} = config;

	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [hasIntersected, setHasIntersected] = useState(false);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Skip if motion should be reduced
		if (shouldReduceMotion()) {
			return;
		}

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const isCurrentlyIntersecting = entry.isIntersecting;

					setIsIntersecting(isCurrentlyIntersecting);

					if (isCurrentlyIntersecting && !hasIntersected) {
						setHasIntersected(true);
					}

					// Call custom callback
					if (onIntersect) {
						onIntersect(isCurrentlyIntersecting, entry);
					}

					// Stop observing if `once` is true and element has intersected
					if (once && hasIntersected && !animateOnExit) {
						observer.unobserve(element);
					}
				});
			},
			{
				threshold,
				rootMargin,
			},
		);

		observer.observe(element);
		observerRef.current = observer;

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [threshold, rootMargin, once, animateOnExit, hasIntersected, onIntersect]);

	return {
		ref,
		isIntersecting,
		hasIntersected,
	};
}

/**
 * Hook for scroll-based parallax effect
 */
export function useParallax(
	speed = 0.5,
	dependencies: React.DependencyList = [],
): {
	ref: React.RefObject<HTMLElement | null>;
	transform: string;
} {
	const ref = useRef<HTMLElement>(null);
	const [transform, setTransform] = useState('translateY(0px)');

	useEffect(() => {
		const element = ref.current;
		if (!element || shouldReduceMotion()) return;

		const updateParallax = throttle(() => {
			const scrolled = window.pageYOffset;
			const rate = scrolled * -speed;

			setTransform(`translateY(${rate}px)`);
		}, 16);

		window.addEventListener('scroll', updateParallax, { passive: true });
		updateParallax(); // Initial calculation

		return () => {
			window.removeEventListener('scroll', updateParallax);
		};
	}, [speed, dependencies]);

	return {
		ref,
		transform,
	};
}

/**
 * Hook for scroll direction detection
 */
export function useScrollDirection(): 'up' | 'down' | null {
	const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
		null,
	);
	const lastScrollY = useRef(0);
	const ticking = useRef(false);

	useEffect(() => {
		const updateScrollDirection = () => {
			const scrollY = window.pageYOffset;

			if (Math.abs(scrollY - lastScrollY.current) < 5) {
				ticking.current = false;
				return;
			}

			setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up');
			lastScrollY.current = scrollY > 0 ? scrollY : 0;
			ticking.current = false;
		};

		const requestTick = () => {
			if (!ticking.current) {
				requestAnimationFrame(updateScrollDirection);
				ticking.current = true;
			}
		};

		window.addEventListener('scroll', requestTick, { passive: true });

		return () => {
			window.removeEventListener('scroll', requestTick);
		};
	}, []);

	return scrollDirection;
}

/**
 * Hook for element in viewport detection
 */
export function useInViewport(
	threshold = 0,
	rootMargin = '0px',
): {
	ref: React.RefObject<HTMLElement | null>;
	isInViewport: boolean;
	entry: IntersectionObserverEntry | null;
} {
	const ref = useRef<HTMLElement>(null);
	const [isInViewport, setIsInViewport] = useState(false);
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsInViewport(entry.isIntersecting);
				setEntry(entry);
			},
			{
				threshold,
				rootMargin,
			},
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [threshold, rootMargin]);

	return {
		ref,
		isInViewport,
		entry,
	};
}
