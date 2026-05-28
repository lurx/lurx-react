'use client';

import gsap from 'gsap';
import { useEffect } from 'react';
import { typewrite } from '@/app/utils/typewrite.util';
import { useEntryAnimation } from '../../entry-animation';
import { INTRO_ORDER } from './use-hero-entry-animation.types';
import type { IntroKey } from './use-hero-entry-animation.types';

const isReduced = () =>
	globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useHeroEntryAnimation = () => {
	const { isShellLoaded } = useEntryAnimation();

	// Set initial hidden state as soon as elements are in the DOM.
	// The hero section is opacity:0 at mount time so nothing is visible yet.
	useEffect(() => {
		if (isReduced()) return;

		gsap.set('[data-hero-intro]', { opacity: 0 });
		gsap.set('[data-hero-widget]', { opacity: 0, scale: 0.75, transformOrigin: 'center' });
		gsap.set('[data-hero-section]', { opacity: 0 });

		return () => {
			gsap.set('[data-hero-intro]', { clearProps: 'all' });
			gsap.set('[data-hero-widget]', { clearProps: 'all' });
			gsap.set('[data-hero-section]', { clearProps: 'all' });
		};
	}, []);

	// Run the animation sequence once the shell entry animation completes.
	useEffect(() => {
		if (!isShellLoaded) return;
		if (isReduced()) return;

		const introEls = INTRO_ORDER.map((key: IntroKey) =>
			document.querySelector<HTMLElement>(`[data-hero-intro="${key}"]`),
		);

		// Save text content only for elements we will typewrite (not the multi-span constLine)
		const savedTexts = new Map<HTMLElement, string>();
		INTRO_ORDER.forEach((key: IntroKey, index: number) => {
			const el = introEls[index];
			if (el && key !== 'const' && key !== 'cta-actions') savedTexts.set(el, el.textContent ?? '');
		});

		const heroTypewriteOpts = { baseDuration: 0.3, charSpeed: 0.05 };
		const tl = gsap.timeline();

		// Phase 1: Reveal intro lines one by one
		INTRO_ORDER.forEach((key: IntroKey, index: number) => {
			const el = introEls[index];
			if (!el) return;

			const position = index === 0 ? 0 : '>';

			if (key === 'const') {
				// Left-to-right clip-path reveal for the multi-span constLine
				tl.fromTo(
					el,
					{ opacity: 1, clipPath: 'inset(0 100% 0 0)' },
					{ clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'none' },
					position,
				);
			} else if (key === 'cta-actions') {
				// Soft fade + lift for the CTA pair — no typewriter (multiple targets)
				tl.fromTo(
					el,
					{ opacity: 0, y: 8 },
					{ opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
					`${position}+=0.15`,
				);
			} else {
				tl.set(el, { opacity: 1 }, position);
				tl.add(typewrite(el, heroTypewriteOpts));
			}
		});

		// Phase 2: Scale + fade in the snippets carousel (right column)
		tl.to(
			'[data-hero-widget]',
			{ opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' },
			'>+=0.15',
		);

		return () => {
			tl.kill();
			savedTexts.forEach((text, el) => {
				el.textContent = text;
				el.style.minWidth = '';
				el.style.minHeight = '';
			});
			gsap.set('[data-hero-intro]', { clearProps: 'all' });
			gsap.set('[data-hero-widget]', { clearProps: 'all' });
			gsap.set('[data-hero-section]', { clearProps: 'all' });
		};
	}, [isShellLoaded]);
};
