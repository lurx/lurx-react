'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';
import { SnippetSlide } from './hero-snippet-slide.component';
import { SNIPPETS, TOTAL_SNIPPETS } from './hero-snippets.constants';
import { getOpacity } from './hero-snippets.helpers';
import styles from './hero-snippets.module.scss';
import type { HeroSnippetsProps } from './hero-snippets.types';

const AUTO_SCROLL_INTERVAL_MS = 2000;

export const HeroSnippets = ({ axis = 'y' }: HeroSnippetsProps) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const [emblaRef, emblaApi] = useEmblaCarousel({
		axis,
		loop: true,
		align: 'center',
		watchDrag: axis === 'x',
	});

	const handlePause = () => setPaused(true);
	const handlePlay = () => setPaused(false);

	useEffect(() => {
		if (!emblaApi) return;
		const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
		emblaApi.on('select', onSelect);
		return () => {
			emblaApi.off('select', onSelect);
		};
	}, [emblaApi]);

	useEffect(() => {
		if (paused || !emblaApi) return;
		const id = setInterval(() => emblaApi.scrollNext(), AUTO_SCROLL_INTERVAL_MS);
		return () => clearInterval(id);
	}, [paused, emblaApi]);

	return (
		<section
			className={styles.viewport}
			ref={emblaRef}
			onMouseEnter={handlePause}
			onMouseLeave={handlePlay}
			onFocus={handlePause}
			onBlur={handlePlay}
			aria-label="Code snippets carousel"
			data-testid="hero-snippets"
			data-axis={axis}
			data-hero-widget
		>
			<div className={styles.emblaContainer}>
				{SNIPPETS.map((snippet, index) => {
					const opacity = getOpacity(index, activeIndex, TOTAL_SNIPPETS);
					return (
						<SnippetSlide
							key={snippet.title}
							title={snippet.title}
							code={snippet.code}
							opacity={opacity}
						/>
					);
				})}
			</div>
		</section>
	);
};
