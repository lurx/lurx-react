'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { type PropsWithChildren, Children, useCallback, useEffect, useState, isValidElement } from 'react';
import styles from './demo-carousel.module.scss';

const getSlideKey = (slide: ReturnType<typeof Children.toArray>[number], index: number): string => {
	if (isValidElement(slide) && slide.key !== null) {
		return String(slide.key);
	}
	return `slide-fallback-${String(index)}`;
};

export const DemoCarousel = ({ children }: PropsWithChildren) => {
	const [emblaRef, emblaApi] = useEmblaCarousel();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [slideCount, setSlideCount] = useState(0);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		setSlideCount(emblaApi.slideNodes().length);
		const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
		emblaApi.on('select', onSelect);
		return () => { emblaApi.off('select', onSelect); };
	}, [emblaApi]);

	const slides = Children.toArray(children);
	const canScrollPrev = selectedIndex > 0;
	const canScrollNext = selectedIndex < slideCount - 1;

	return (
		<div className={styles.carousel}>
			<div className={styles.viewport} ref={emblaRef}>
				<div className={styles.container}>
					{slides.map((slide, slideIndex) => (
						<div className={styles.slide} key={getSlideKey(slide, slideIndex)}>
							{slide}
						</div>
					))}
				</div>
			</div>

			{slideCount > 1 && (
				<>
					<button
						className={styles.prev}
						onClick={scrollPrev}
						disabled={!canScrollPrev}
						aria-label="Previous demo"
					>
						&#8592;
					</button>
					<button
						className={styles.next}
						onClick={scrollNext}
						disabled={!canScrollNext}
						aria-label="Next demo"
					>
						&#8594;
					</button>

					<div className={styles.dots}>
						{slides.map((slide, dotIndex) => (
							<button
								key={`dot-${getSlideKey(slide, dotIndex)}`}
								className={styles.dot}
								data-active={dotIndex === selectedIndex}
								onClick={() => emblaApi?.scrollTo(dotIndex)}
								aria-label={`Go to demo ${dotIndex + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};
