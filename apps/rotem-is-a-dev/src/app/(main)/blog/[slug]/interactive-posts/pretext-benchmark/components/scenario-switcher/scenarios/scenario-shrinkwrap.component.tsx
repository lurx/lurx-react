'use client';

import { useEffect, useState } from 'react';
import postStyles from '../../../pretext-benchmark.module.scss';
import demoStyles from './scenario-demos.module.scss';
import type { ShrinkwrapResult } from './shrinkwrap-demo.helpers';
import type { BubbleMessage } from './shrinkwrap-demo.types';

const MESSAGES = [
	{ text: 'Hey, did you see the new pretext library? It does text measurement without touching the DOM at all', side: 'right' },
	{ text: 'Yeah I saw it! The prepare/layout split is really clever for virtualised lists', side: 'left' },
	{ text: 'Exactly. And the hot path is pure arithmetic — no canvas calls, no reflows', side: 'right' },
] satisfies BubbleMessage[];

export function ScenarioShrinkwrap() {
	const [results, setResults] = useState<ShrinkwrapResult[] | null>(null);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const { computeShrinkwrap } = await import('./shrinkwrap-demo.helpers');

			if (cancelled) return;

			const computed = computeShrinkwrap(MESSAGES.map(msg => msg.text));
			setResults(computed);
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<>
			<h3 className={postStyles.subheading}>Chat bubble shrinkwrap</h3>
			<p className={postStyles.paragraph}>
				<code className={postStyles.inlineCode}>width: fit-content</code> sizes a container to its widest
				wrapped line. If a message wraps to 3 lines and the last line is short, the bubble still stretches
				to the longest line &mdash; leaving dead white space that looks wrong for a messenger UI.
			</p>
			<p className={postStyles.paragraph}>
				Pretext&apos;s <code className={postStyles.inlineCode}>layout()</code> lets you binary-search
				the minimum width that still produces the same line count. The result: bubbles that are as tight
				as possible without getting shorter.
			</p>

			<div className={postStyles.compare}>
				<div className={postStyles.comparePane}>
					<div className={`${postStyles.comparePaneHeader} ${postStyles.bad}`}>CSS fit-content</div>
					<div className={postStyles.comparePaneBody}>
						<div className={demoStyles.bubbleDemo}>
							{MESSAGES.map((msg, idx) => {
								const result = results?.[idx];
								const sideClass = msg.side === 'right' ? demoStyles.bubbleRight : demoStyles.bubbleLeft;

								return (
									<div
										key={msg.text}
										className={`${demoStyles.bubble} ${sideClass}`}
										style={{ width: 'fit-content', maxWidth: 320, position: 'relative' }}
									>
										{msg.text}
										{result && result.wastePercent > 0 && (
											<div
												className={demoStyles.wasteMarker}
												style={{ width: `${result.wastePercent}%` }}
											/>
										)}
									</div>
								);
							})}
						</div>
						{results && (
							<p className={demoStyles.wasteLabel}>
								Red = wasted space ({results.map(res => `${res.wastePercent}%`).join(', ')})
							</p>
						)}
					</div>
				</div>
				<div className={postStyles.comparePane}>
					<div className={`${postStyles.comparePaneHeader} ${postStyles.good}`}>Pretext shrinkwrap</div>
					<div className={postStyles.comparePaneBody}>
						<div className={demoStyles.bubbleDemo}>
							{MESSAGES.map((msg, idx) => {
								const result = results?.[idx];
								const sideClass = msg.side === 'right' ? demoStyles.bubbleRight : demoStyles.bubbleLeft;

								return (
									<div
										key={msg.text}
										className={`${demoStyles.bubble} ${sideClass}`}
										style={{
											width: result ? result.shrinkwrapWidth : 'fit-content',
											maxWidth: 320,
										}}
									>
										{msg.text}
									</div>
								);
							})}
						</div>
						{results && (
							<p className={postStyles.footnote}>
								Widths computed by pretext: {results.map(res => `${res.shrinkwrapWidth}px`).join(', ')}
								{' '}(vs fit-content: {results.map(res => `${res.fitContentWidth}px`).join(', ')})
							</p>
						)}
					</div>
				</div>
			</div>

			<div className={`${postStyles.callout} ${postStyles.good}`}>
				<strong>Verdict: CSS literally cannot do this.</strong> There is no CSS property that finds
				the narrowest width producing exactly N lines. That requires running layout at multiple widths
				and comparing line counts &mdash; which is exactly what pretext&apos;s API makes trivial. This is one of
				the &ldquo;impossible things&rdquo; pretext unlocks.
			</div>
		</>
	);
}
