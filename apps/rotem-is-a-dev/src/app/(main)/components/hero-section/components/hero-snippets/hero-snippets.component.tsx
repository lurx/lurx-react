'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';
import { useHeroContext } from '../../hero.context';
import { SnippetSlide } from './hero-snippet-slide.component';
import { SNIPPETS, TOTAL_SNIPPETS } from './hero-snippets.constants';
import { getOpacity } from './hero-snippets.helpers';
import styles from './hero-snippets.module.scss';

export const HeroSnippets = () => {
	const { gameCompleted } = useHeroContext();
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const [emblaRef, emblaApi] = useEmblaCarousel({
		axis: 'y',
		loop: true,
		align: 'center',
		watchDrag: false,
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
		if (!gameCompleted || paused || !emblaApi) return;
		const id = setInterval(() => emblaApi.scrollNext(), 2000);
		return () => clearInterval(id);
	}, [gameCompleted, paused, emblaApi]);

	if (!gameCompleted) return null;

	return (
		<div
			className={styles.viewport}
			ref={emblaRef}
			onMouseEnter={handlePause}
			onMouseLeave={handlePlay}
			aria-label="Code snippets carousel"
			data-testid="hero-snippets"
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
		</div>
	);
};
