'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { type PropsWithChildren, Children, useCallback, useEffect, useState } from 'react';
import styles from './demo-carousel.module.scss';

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
					{slides.map((slide, index) => (
						<div className={styles.slide} key={index}>
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
						{slides.map((_, index) => (
							<button
								key={index}
								className={styles.dot}
								data-active={index === selectedIndex}
								onClick={() => emblaApi?.scrollTo(index)}
								aria-label={`Go to demo ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};
