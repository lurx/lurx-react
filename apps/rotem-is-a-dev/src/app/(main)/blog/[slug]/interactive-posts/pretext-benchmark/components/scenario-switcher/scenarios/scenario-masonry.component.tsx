'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import postStyles from '../../../pretext-benchmark.module.scss';
import demoStyles from './scenario-demos.module.scss';
import type { PreparedCard, MasonryLayout } from './masonry-demo.helpers';

const CARD_COLORS = [
	'rgba(99, 102, 241, 0.15)',   // indigo
	'rgba(244, 114, 182, 0.15)',  // pink
	'rgba(34, 197, 94, 0.15)',    // green
	'rgba(251, 146, 60, 0.15)',   // orange
	'rgba(56, 189, 248, 0.15)',   // sky
	'rgba(168, 85, 247, 0.15)',   // purple
	'rgba(250, 204, 21, 0.15)',   // yellow
	'rgba(20, 184, 166, 0.15)',   // teal
];

const CARD_BORDERS = [
	'rgba(99, 102, 241, 0.3)',
	'rgba(244, 114, 182, 0.3)',
	'rgba(34, 197, 94, 0.3)',
	'rgba(251, 146, 60, 0.3)',
	'rgba(56, 189, 248, 0.3)',
	'rgba(168, 85, 247, 0.3)',
	'rgba(250, 204, 21, 0.3)',
	'rgba(20, 184, 166, 0.3)',
];

export function ScenarioMasonry() {
	const [cards, setCards] = useState<PreparedCard[] | null>(null);
	const [masonryLayout, setMasonryLayout] = useState<MasonryLayout | null>(null);
	const [containerWidth, setContainerWidth] = useState(600);
	const [layoutTimeUs, setLayoutTimeUs] = useState(0);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	// Prepare cards on mount
	useEffect(() => {
		let cancelled = false;

		(async () => {
			const { prepareCards } = await import('./masonry-demo.helpers');

			if (cancelled) return;
			setCards(prepareCards());
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	// Recompute layout when width or cards change
	useEffect(() => {
		if (!cards) return;

		(async () => {
			const { computeMasonryLayout } = await import('./masonry-demo.helpers');
			const start = performance.now();
			const result = computeMasonryLayout(cards, containerWidth);
			const elapsed = performance.now() - start;

			setMasonryLayout(result);
			setLayoutTimeUs(Math.round(elapsed * 1000));
		})();
	}, [cards, containerWidth]);

	// Drag-to-resize
	const handlePointerDown = useCallback((ev: React.PointerEvent) => {
		ev.preventDefault();
		isDragging.current = true;
		(ev.target as HTMLElement).setPointerCapture(ev.pointerId);
	}, []);

	const handlePointerMove = useCallback((ev: React.PointerEvent) => {
		if (!isDragging.current || !wrapperRef.current) return;

		const rect = wrapperRef.current.getBoundingClientRect();
		const newWidth = Math.max(280, Math.min(ev.clientX - rect.left, rect.width));
		setContainerWidth(Math.round(newWidth));
	}, []);

	const handlePointerUp = useCallback(() => {
		isDragging.current = false;
	}, []);

	// Set initial width from wrapper
	useEffect(() => {
		if (!wrapperRef.current) return;

		const observer = new ResizeObserver(entries => {
			const entry = entries[0];

			if (entry && !isDragging.current) {
				setContainerWidth(Math.round(entry.contentRect.width));
			}
		});

		observer.observe(wrapperRef.current);
		setContainerWidth(Math.round(wrapperRef.current.getBoundingClientRect().width));

		return () => observer.disconnect();
	}, []);

	return (
		<>
			<h3 className={postStyles.subheading}>Masonry layout with height prediction</h3>
			<p className={postStyles.paragraph}>
				Masonry assigns cards to whichever column is currently shortest. The problem: you need card
				heights before mounting them to know the optimal column assignment. Drag the right edge to
				resize &mdash; pretext recomputes all heights instantly via <code className={postStyles.inlineCode}>layout()</code>,
				no DOM measurement needed.
			</p>

			<div className={demoStyles.masonryWrapper} ref={wrapperRef}>
				<div
					className={demoStyles.masonryContainer}
					style={{
						width: containerWidth,
						height: masonryLayout?.contentHeight ?? 400,
					}}
				>
					{masonryLayout?.positionedCards.map(pos => {
						const card = cards?.[pos.cardIndex];

						if (!card) return null;

						return (
							<div
								key={pos.cardIndex}
								className={demoStyles.masonryCard}
								style={{
									transform: `translate(${pos.x}px, ${pos.y}px)`,
									width: pos.width,
									height: pos.height,
									backgroundColor: CARD_COLORS[card.colorIndex],
									border: `1px solid ${CARD_BORDERS[card.colorIndex]}`,
								}}
							>
								{card.text}
							</div>
						);
					})}
				</div>
				<div
					className={demoStyles.masonryResizeHandle}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
				/>
			</div>

			<div className={demoStyles.masonryMeta}>
				<span>Width: {containerWidth}px</span>
				<span>Layout: {layoutTimeUs}&#xB5;s for {cards?.length ?? 0} cards</span>
			</div>

			<div className={`${postStyles.callout} ${postStyles.good}`}>
				<strong>Verdict: Solid use case.</strong> Pretext predicts text card heights without mounting,
				enabling correct masonry assignment on the first render. Resize triggers only <code className={postStyles.inlineCode}>layout()</code> &mdash;
				pure arithmetic, no DOM reads.
			</div>
		</>
	);
}
