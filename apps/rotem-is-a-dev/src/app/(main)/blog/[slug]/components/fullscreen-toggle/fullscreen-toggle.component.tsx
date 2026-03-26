'use client';

import { FaIcon } from '@/app/components/fa-icon';
import gsap from 'gsap';
import { useCallback, useRef, useState } from 'react';
import styles from '../../blog-post.module.scss';

const ARTICLE_SELECTOR = `.${styles.page}`;
const ANIMATION_DURATION = 0.4;
const ANIMATION_EASE = 'power2.inOut';

export const FullscreenToggle = () => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const tweenRef = useRef<gsap.core.Tween | null>(null);
	const originalRectRef = useRef<DOMRect | null>(null);

	const toggle = useCallback(() => {
		const article = document.querySelector(ARTICLE_SELECTOR);
		if (!article) return;

		tweenRef.current?.kill();

		const next = !isFullscreen;

		if (next) {
			const rect = article.getBoundingClientRect();
			originalRectRef.current = rect;

			gsap.set(article, {
				position: 'fixed',
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
				zIndex: 'var(--z-overlay)',
				backgroundColor: 'var(--surface)',
			});

			tweenRef.current = gsap.to(article, {
				top: 0,
				left: 0,
				width: '100vw',
				height: '100dvh',
				borderRadius: 0,
				duration: ANIMATION_DURATION,
				ease: ANIMATION_EASE,
			});
		} else {
			const rect = originalRectRef.current;
			if (!rect) return;

			tweenRef.current = gsap.to(article, {
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
				borderRadius: '',
				duration: ANIMATION_DURATION,
				ease: ANIMATION_EASE,
				onComplete: () => {
					gsap.set(article, { clearProps: 'all' });
				},
			});
		}

		setIsFullscreen(next);
	}, [isFullscreen]);

	const label = isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
	const iconName = isFullscreen ? 'arrows-minimize' : 'arrows-maximize';

	return (
		<button
			type="button"
			className={styles.fullscreenToggle}
			onClick={toggle}
			aria-label={label}
			title={label}
		>
			<FaIcon iconName={iconName} iconGroup="fal" size="sm" />
		</button>
	);
};
