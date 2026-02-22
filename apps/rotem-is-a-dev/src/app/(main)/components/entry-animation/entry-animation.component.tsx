'use client';

import gsap from 'gsap';
import { useEffect } from 'react';
import { typewrite } from '@/app/utils/typewrite.util';
import { SESSION_KEY, useEntryAnimation } from './entry-animation.context';

export const EntryAnimation = () => {
	const { setIsShellLoaded, animationKey } = useEntryAnimation();

	useEffect(() => {
		const shouldSkip =
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			Boolean(sessionStorage.getItem(SESSION_KEY));

		if (shouldSkip) {
			setIsShellLoaded(true);
			return;
		}

		const pageEl = document.querySelector('[data-page]') as HTMLElement | null;
		if (!pageEl) {
			setIsShellLoaded(true);
			return;
		}

		sessionStorage.setItem(SESSION_KEY, 'true');

		// Collect text elements by section to enforce left→right, header→footer order
		const navbarTextEls = gsap.utils.toArray<HTMLElement>(
			'[data-animate-text="logo"], [data-animate-text="nav-item"], [data-animate-text="download-cv"], [data-animate-text="contact"]',
		);
		const footerTextEls = gsap.utils.toArray<HTMLElement>(
			'[data-animate-text="footer-label"], [data-animate-text="footer-username"]',
		);
		const allTextEls = [...navbarTextEls, ...footerTextEls];

		const savedTexts = new Map<HTMLElement, string>();
		allTextEls.forEach(el => savedTexts.set(el, el.textContent ?? ''));

		const tl = gsap.timeline();

		// Phase 1 — navbar typewriter, left to right
		const shellTypewriteOpts = { setDataFullText: true };

		navbarTextEls.forEach((el, index) => {
			tl.add(typewrite(el, shellTypewriteOpts), index === 0 ? 0 : '<+=0.15');
		});

		// Phase 2 — footer typewriter, left to right (starts when navbar finishes)
		footerTextEls.forEach((el, index) => {
			tl.add(typewrite(el, shellTypewriteOpts), index === 0 ? '>' : '<+=0.15');
		});

		// Phase 3 — horizontal border draw
		tl.from('[data-border-h="nav"]', {
			scaleX: 0,
			duration: 0.45,
			ease: 'power2.inOut',
			transformOrigin: 'center',
		});
		tl.from(
			'[data-border-h="footer"]',
			{ scaleX: 0, duration: 0.45, ease: 'power2.inOut', transformOrigin: 'right' },
			'<+=0.1',
		);

		// Phase 4 — icon fade
		tl.from(
			'[data-animate-icon]',
			{
				opacity: 0,
				scale: 0.8,
				duration: 0.4,
				stagger: { each: 0.08, from: 'random' },
				ease: 'back.out(1.7)',
			},
			'<+=0.2',
		);

		// Phase 5 — hand off to page content
		tl.call(() => setIsShellLoaded(true), undefined, '>-30%');

		return () => {
			tl.kill();
			savedTexts.forEach((text, el) => {
				el.textContent = text;
				el.style.minWidth = '';
				el.style.minHeight = '';
			});
			gsap.set('[data-border-h]', { clearProps: 'all' });
			gsap.set('[data-animate-icon]', { clearProps: 'all' });
			sessionStorage.removeItem(SESSION_KEY);
		};
	}, [animationKey, setIsShellLoaded]);

	return null;
};
