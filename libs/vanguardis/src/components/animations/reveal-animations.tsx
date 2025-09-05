import React, { useEffect, useRef } from 'react';
import {
	getAnimationDuration,
	shouldReduceMotion,
} from '../../utils/animation.utils';

interface FadeInProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
	direction?: 'up' | 'down' | 'left' | 'right';
	distance?: number;
	once?: boolean;
	threshold?: number;
}

interface StaggerFadeInProps {
	children: React.ReactNode;
	className?: string;
	stagger?: { stagger: number };
	itemSelector?: string;
	direction?: 'up' | 'down' | 'left' | 'right';
	distance?: number;
	once?: boolean;
	threshold?: number;
}

interface SlideInProps {
	children: React.ReactNode;
	className?: string;
	direction: 'left' | 'right' | 'up' | 'down';
	distance?: number;
	duration?: number;
	delay?: number;
	once?: boolean;
	threshold?: number;
}

interface ScaleInProps {
	children: React.ReactNode;
	className?: string;
	scale?: number;
	duration?: number;
	delay?: number;
	once?: boolean;
	threshold?: number;
}

/**
 * FadeIn animation component with intersection observer
 */
export function FadeIn({
	children,
	className = '',
	delay = 0,
	duration = 800,
	direction = 'up',
	distance = 30,
	once = true,
	threshold = 0.1,
}: FadeInProps): React.JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		const element = ref.current;
		if (!element || shouldReduceMotion()) return;

		// Set initial state with CSS
		const initialTransform = {
			up: `translateY(${distance}px)`,
			down: `translateY(-${distance}px)`,
			left: `translateX(${distance}px)`,
			right: `translateX(-${distance}px)`,
		}[direction];

		element.style.opacity = '0';
		element.style.transform = initialTransform;
		element.style.transition = `opacity ${getAnimationDuration(
			duration,
		)}ms ease-out, transform ${getAnimationDuration(duration)}ms ease-out`;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && (!once || !hasAnimated.current)) {
					hasAnimated.current = true;

					// Animate with CSS transitions
					setTimeout(() => {
						element.style.opacity = '1';
						element.style.transform = 'translateX(0) translateY(0)';
					}, getAnimationDuration(delay));

					if (once) {
						observer.unobserve(element);
					}
				}
			},
			{ threshold },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [delay, duration, direction, distance, once, threshold]);

	return (
		<div
			ref={ref}
			className={className}
		>
			{children}
		</div>
	);
}

/**
 * Stagger animation component for multiple elements
 */
export function StaggerFadeIn({
	children,
	className = '',
	stagger = { stagger: 100 },
	itemSelector = '> *',
	direction = 'up',
	distance = 30,
	once = true,
	threshold = 0.1,
}: StaggerFadeInProps): React.JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		const container = ref.current;
		if (!container || shouldReduceMotion()) return;

		const elements = container.querySelectorAll(itemSelector);
		if (elements.length === 0) return;

		// Set initial state for all elements
		const initialTransform = {
			up: `translateY(${distance}px)`,
			down: `translateY(-${distance}px)`,
			left: `translateX(${distance}px)`,
			right: `translateX(-${distance}px)`,
		}[direction];

		elements.forEach(element => {
			if (element instanceof HTMLElement) {
				element.style.opacity = '0';
				element.style.transform = initialTransform;
				element.style.transition =
					'opacity 600ms ease-out, transform 600ms ease-out';
			}
		});

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && (!once || !hasAnimated.current)) {
					hasAnimated.current = true;

					// Animate elements with stagger
					elements.forEach((element, index) => {
						if (element instanceof HTMLElement) {
							setTimeout(() => {
								element.style.opacity = '1';
								element.style.transform = 'translateX(0) translateY(0)';
							}, index * getAnimationDuration(stagger.stagger));
						}
					});

					if (once) {
						observer.unobserve(container);
					}
				}
			},
			{ threshold },
		);

		observer.observe(container);

		return () => observer.disconnect();
	}, [stagger, itemSelector, direction, distance, once, threshold]);

	return (
		<div
			ref={ref}
			className={className}
		>
			{children}
		</div>
	);
}

/**
 * Slide-in animation component
 */
export function SlideIn({
	children,
	className = '',
	direction,
	distance = 50,
	duration = 600,
	delay = 0,
	once = true,
	threshold = 0.1,
}: SlideInProps): React.JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		const element = ref.current;
		if (!element || shouldReduceMotion()) return;

		// Set initial state
		const initialTransform = {
			left: `translateX(-${distance}px)`,
			right: `translateX(${distance}px)`,
			up: `translateY(-${distance}px)`,
			down: `translateY(${distance}px)`,
		}[direction];

		element.style.opacity = '0';
		element.style.transform = initialTransform;
		element.style.transition = `opacity ${getAnimationDuration(
			duration,
		)}ms ease-out, transform ${getAnimationDuration(duration)}ms ease-out`;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && (!once || !hasAnimated.current)) {
					hasAnimated.current = true;

					setTimeout(() => {
						element.style.opacity = '1';
						element.style.transform = 'translateX(0) translateY(0)';
					}, getAnimationDuration(delay));

					if (once) {
						observer.unobserve(element);
					}
				}
			},
			{ threshold },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [direction, distance, duration, delay, once, threshold]);

	return (
		<div
			ref={ref}
			className={className}
		>
			{children}
		</div>
	);
}

/**
 * Scale-in animation component
 */
export function ScaleIn({
	children,
	className = '',
	scale = 0.8,
	duration = 600,
	delay = 0,
	once = true,
	threshold = 0.1,
}: ScaleInProps): React.JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		const element = ref.current;
		if (!element || shouldReduceMotion()) return;

		// Set initial state
		element.style.opacity = '0';
		element.style.transform = `scale(${scale})`;
		element.style.transition = `opacity ${getAnimationDuration(
			duration,
		)}ms ease-out, transform ${getAnimationDuration(
			duration,
		)}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && (!once || !hasAnimated.current)) {
					hasAnimated.current = true;

					setTimeout(() => {
						element.style.opacity = '1';
						element.style.transform = 'scale(1)';
					}, getAnimationDuration(delay));

					if (once) {
						observer.unobserve(element);
					}
				}
			},
			{ threshold },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [scale, duration, delay, once, threshold]);

	return (
		<div
			ref={ref}
			className={className}
		>
			{children}
		</div>
	);
}
