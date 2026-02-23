'use client';

import { useShikiTokens } from '@/lib/shiki';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';
import styles from './hero-snippets.module.scss';
import { useHeroContext } from './hero.context';
import chunkRaw from './snippets/chunk.snippet.ts?raw';
import debounceRaw from './snippets/debounce.snippet.ts?raw';
import deepCloneRaw from './snippets/deep-clone.snippet.ts?raw';
import flattenRaw from './snippets/flatten.snippet.ts?raw';
import groupByRaw from './snippets/group-by.snippet.ts?raw';
import memoizeRaw from './snippets/memoize.snippet.ts?raw';
import throttleRaw from './snippets/throttle.snippet.ts?raw';

const SNIPPETS = [
	{ title: 'debounce', code: debounceRaw },
	{ title: 'throttle', code: throttleRaw },
	{ title: 'deep-clone', code: deepCloneRaw },
	{ title: 'flatten', code: flattenRaw },
	{ title: 'group-by', code: groupByRaw },
	{ title: 'memoize', code: memoizeRaw },
	{ title: 'chunk', code: chunkRaw },
];

const TOTAL_SNIPPETS = SNIPPETS.length;

function getOpacity(index: number, active: number): number {
	let rel = (((index - active) % TOTAL_SNIPPETS) + TOTAL_SNIPPETS) % TOTAL_SNIPPETS;
	if (rel > Math.floor(TOTAL_SNIPPETS / 2)) rel -= TOTAL_SNIPPETS;
	const dist = Math.abs(rel);
	if (dist === 0) return 1;
	if (dist === 1) return 0.4;
	return 0.1;
}

const SnippetSlide = ({
	title,
	code,
	opacity,
}: {
	title: string;
	code: string;
	opacity: number;
}) => {
	const shikiLines = useShikiTokens({ code, language: 'typescript' });

	return (
		<div
			className={styles.slide}
			style={{ opacity }}
		>
			<p className={styles.slideLabel}>{title}</p>
			<pre className={styles.code}>
				<code>
					{shikiLines
						? shikiLines.map((line, index) => (
								<span key={index}>
									{line.tokens.map((token, tokenIndex) => (
										<span
											key={tokenIndex}
											style={{ color: token.color }}
										>
											{token.content}
										</span>
									))}
									{'\n'}
								</span>
							))
						: code}
				</code>
			</pre>
		</div>
	);
};

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
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			aria-label="Code snippets carousel"
			data-testid="hero-snippets"
		>
			<div className={styles.emblaContainer}>
				{SNIPPETS.map((snippet, index) => (
					<SnippetSlide
						key={snippet.title}
						title={snippet.title}
						code={snippet.code}
						opacity={getOpacity(index, activeIndex)}
					/>
				))}
			</div>
		</div>
	);
};
