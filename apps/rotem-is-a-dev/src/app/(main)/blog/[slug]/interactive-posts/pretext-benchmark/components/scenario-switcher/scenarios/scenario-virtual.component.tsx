import { CodeBlock } from '@/app/components';
import postStyles from '../../../pretext-benchmark.module.scss';

export function ScenarioVirtual() {
	return (
		<>
			<h3 className={postStyles.subheading}>Virtualised lists with variable-height rows</h3>
			<p className={postStyles.paragraph}>
				Virtual scrolling renders only what&apos;s visible, offsetting content to simulate a large list.
				The hard part: computing each row&apos;s height to know the total scroll height and which rows
				are currently visible. With fixed-height rows this is trivial. With text of varying length
				it has always required either sampling the DOM or accepting wrong estimates.
			</p>
			<p className={postStyles.paragraph}>
				The conventional approach uses a ResizeObserver or a one-time measurement pass with hidden
				elements. Both require elements to exist in the DOM before you know their height &mdash; which
				forces a two-phase render or eager DOM population. Pretext breaks this dependency.
			</p>
			<div className={postStyles.compare}>
				<div className={postStyles.comparePane}>
					<div className={`${postStyles.comparePaneHeader} ${postStyles.bad}`}>&#x2717; Traditional virtual scroll</div>
					<div className={postStyles.comparePaneBody}>
						<CodeBlock
							code={`// Must pre-render items to measure\nconst heights = items.map(item => {\n  ghost.textContent = item.text;\n  return ghost.getBoundingClientRect().height;\n  // Reflow for every item\n});\ntotalHeight = heights.reduce((a,b) => a+b);`}
							language="javascript"
						/>
					</div>
				</div>
				<div className={postStyles.comparePane}>
					<div className={`${postStyles.comparePaneHeader} ${postStyles.good}`}>&#x2713; Pretext virtual scroll</div>
					<div className={postStyles.comparePaneBody}>
						<CodeBlock
							code={`// Measure once, reuse forever\nconst prepared = items.map(item =>\n  prepare(item.text, font)\n);\nconst heights = prepared.map(p =>\n  layout(p, columnWidth, lineH).height\n);\n// No DOM. Runs in a Worker.`}
							language="javascript"
						/>
					</div>
				</div>
			</div>
			<div className={`${postStyles.callout} ${postStyles.good}`}>
				<strong>Verdict: Strong use case.</strong> Pretext was essentially designed for this.
				The prepare/layout split maps perfectly onto virtualised list architecture &mdash; prepare when data
				loads, layout when width changes. The ability to run in a Web Worker is a meaningful bonus.
			</div>
		</>
	);
}
