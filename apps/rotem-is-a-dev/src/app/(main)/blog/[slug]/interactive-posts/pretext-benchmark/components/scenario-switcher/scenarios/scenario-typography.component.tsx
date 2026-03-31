'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import postStyles from '../../../pretext-benchmark.module.scss';
import demoStyles from './scenario-demos.module.scss';
import type { TypographyResult } from './typography-demo.helpers';
import { TYPOGRAPHY_TEXT } from './typography-demo.helpers';

const CANVAS_PADDING = 24;

export function ScenarioTypography() {
	const [result, setResult] = useState<TypographyResult | null>(null);
	const greedyCanvasRef = useRef<HTMLCanvasElement>(null);
	const optimalCanvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const computeAndDraw = useCallback(async (width: number) => {
		const { computeTypography, drawJustifiedText } = await import('./typography-demo.helpers');

		const maxWidth = width - CANVAS_PADDING * 2;

		if (maxWidth < 100) return;

		const computed = computeTypography(maxWidth);
		setResult(computed);

		const dpr = window.devicePixelRatio || 1;
		const canvasHeight = Math.max(computed.greedyLines.length, computed.optimalLines.length) * 26 + CANVAS_PADDING;

		// Draw greedy
		const greedyCanvas = greedyCanvasRef.current;

		if (greedyCanvas) {
			greedyCanvas.width = width * dpr;
			greedyCanvas.height = canvasHeight * dpr;
			greedyCanvas.style.width = `${width}px`;
			greedyCanvas.style.height = `${canvasHeight}px`;

			const ctx = greedyCanvas.getContext('2d');

			if (ctx) {
				ctx.scale(dpr, dpr);
				ctx.clearRect(0, 0, width, canvasHeight);
				ctx.save();
				ctx.translate(CANVAS_PADDING, CANVAS_PADDING / 2);
				drawJustifiedText(ctx, computed.greedyLines, computed.greedySpacings, maxWidth, 0, true);
				ctx.restore();
			}
		}

		// Draw optimal
		const optimalCanvas = optimalCanvasRef.current;

		if (optimalCanvas) {
			optimalCanvas.width = width * dpr;
			optimalCanvas.height = canvasHeight * dpr;
			optimalCanvas.style.width = `${width}px`;
			optimalCanvas.style.height = `${canvasHeight}px`;

			const ctx = optimalCanvas.getContext('2d');

			if (ctx) {
				ctx.scale(dpr, dpr);
				ctx.clearRect(0, 0, width, canvasHeight);
				ctx.save();
				ctx.translate(CANVAS_PADDING, CANVAS_PADDING / 2);
				drawJustifiedText(ctx, computed.optimalLines, computed.optimalSpacings, maxWidth, 0, false);
				ctx.restore();
			}
		}
	}, []);

	// Initial draw + resize observer
	useEffect(() => {
		const container = containerRef.current;

		if (!container) return;

		const observer = new ResizeObserver(entries => {
			const entry = entries[0];

			if (entry) {
				const paneWidth = Math.floor(entry.contentRect.width / 2) - 8;
				computeAndDraw(paneWidth);
			}
		});

		observer.observe(container);

		const paneWidth = Math.floor(container.getBoundingClientRect().width / 2) - 8;
		computeAndDraw(paneWidth);

		return () => observer.disconnect();
	}, [computeAndDraw]);

	const greedyMaxSpacing = result
		? Math.max(...result.greedySpacings)
		: 0;
	const optimalMaxSpacing = result
		? Math.max(...result.optimalSpacings)
		: 0;

	return (
		<>
			<h3 className={postStyles.subheading}>Typography: justification and text shaping</h3>
			<p className={postStyles.paragraph}>
				CSS <code className={postStyles.inlineCode}>text-align: justify</code> uses a greedy
				line-breaking algorithm &mdash; it fills each line as much as possible before wrapping.
				This creates &ldquo;rivers&rdquo;: vertical channels of whitespace that flow down through
				paragraphs and disrupt reading. Below, both paragraphs are rendered on canvas using pretext&apos;s
				line data &mdash; the left uses greedy breaks, the right uses balanced breaks.
			</p>

			<div className={demoStyles.typographyCompare} ref={containerRef}>
				<div className={demoStyles.typographyPane}>
					<div className={`${demoStyles.typographyLabel} ${demoStyles.typographyLabelBad}`}>
						Greedy line-breaking (CSS default)
					</div>
					<canvas ref={greedyCanvasRef} role="img" aria-label="Text justified with greedy line-breaking, showing uneven word spacing and river gaps highlighted in red" />
					<p style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{TYPOGRAPHY_TEXT}</p>
					{result && (
						<p className={postStyles.footnote}>
							Worst gap: {greedyMaxSpacing.toFixed(1)}px &mdash; red highlights show rivers
						</p>
					)}
				</div>
				<div className={demoStyles.typographyPane}>
					<div className={`${demoStyles.typographyLabel} ${demoStyles.typographyLabelGood}`}>
						Balanced line-breaking (via pretext)
					</div>
					<canvas ref={optimalCanvasRef} role="img" aria-label="Text justified with balanced line-breaking via pretext, showing more even word spacing" />
					<p style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{TYPOGRAPHY_TEXT}</p>
					{result && (
						<p className={postStyles.footnote}>
							Worst gap: {optimalMaxSpacing.toFixed(1)}px &mdash; {((1 - optimalMaxSpacing / greedyMaxSpacing) * 100).toFixed(0)}% tighter
						</p>
					)}
				</div>
			</div>

			<p className={postStyles.paragraph}>
				Pretext&apos;s <code className={postStyles.inlineCode}>layoutWithLines()</code> returns per-line text and widths,
				making it trivial to compute justification spacing. The balanced version binary-searches for the narrowest
				width that keeps the same line count &mdash; evening out line lengths and reducing worst-case gaps.
			</p>
			<div className={postStyles.callout}>
				<strong>Verdict: Niche but powerful.</strong> Editorial sites, reading apps, and digital
				magazines have been stuck with CSS&apos;s greedy justification for years. Pretext is the first
				JS library that makes better justification practical in proportional fonts at browser
				speed. The trade-off: you&apos;re rendering to Canvas, not HTML, so accessibility and selection
				require extra work.
			</div>
		</>
	);
}
