import { CodeBlock } from '@/app/components';
import { IMPOSSIBLE_THINGS } from '../../pretext-benchmark.constants';
import { VerdictBox } from '../verdict-box';
import styles from '../../pretext-benchmark.module.scss';

export function CodeCompare() {
	return (
		<div className={styles.compare}>
			<div className={styles.comparePane}>
				<div className={`${styles.comparePaneHeader} ${styles.bad}`}>&#x2717; DOM approach</div>
				<div className={styles.comparePaneBody}>
					<CodeBlock
						code={`// Forces layout reflow every call\nfunction getHeight(text, width) {\n  el.style.width = width + 'px';\n  el.textContent = text;\n  return el.getBoundingClientRect().height;\n  // triggers full layout reflow\n}`}
						language="javascript"
					/>
					<p className={styles.footnote}>~0.18ms per batch (500 items, resize)</p>
				</div>
			</div>
			<div className={styles.comparePane}>
				<div className={`${styles.comparePaneHeader} ${styles.good}`}>&#x2713; Pretext approach</div>
				<div className={styles.comparePaneBody}>
					<CodeBlock
						code={`// One-time prep: canvas measureText\nconst prepared = prepare(text, '16px Inter');\n\n// Hot path: pure arithmetic\nconst { height } = layout(prepared, width, 24);\n// no DOM, no reflow, ~0.0002ms`}
						language="javascript"
					/>
					<p className={styles.footnote}>~0.02ms for all 500 items on resize</p>
				</div>
			</div>
		</div>
	);
}

export function StatsRow() {
	return (
		<div className={styles.statsRow}>
			<div className={styles.statBox}>
				<div className={styles.statValue}>19ms</div>
				<div className={styles.statLabel}>prepare() &middot; 500 texts &middot; once</div>
			</div>
			<div className={styles.statBox}>
				<div className={styles.statValue}>0.09ms</div>
				<div className={styles.statLabel}>layout() &middot; 500 texts &middot; hot path</div>
			</div>
			<div className={styles.statBox}>
				<div className={styles.statValue}>100%</div>
				<div className={styles.statLabel}>accuracy &middot; named fonts &middot; curated corpus</div>
			</div>
			<div className={styles.statBox}>
				<div className={styles.statValue}>7680</div>
				<div className={styles.statLabel}>test cases &middot; 4 fonts &times; 8 sizes &times; 8 widths &times; 30 texts</div>
			</div>
		</div>
	);
}

export function ImpossibleThingsGrid() {
	return (
		<div className={styles.impossibleGrid}>
			{IMPOSSIBLE_THINGS.map(thing => (
				<div key={thing.label} className={styles.impossibleCard}>
					<div className={styles.impossibleCardIcon}>{thing.icon}</div>
					<div className={styles.impossibleCardLabel}>{thing.label}</div>
					<div className={styles.impossibleCardDesc}>{thing.description}</div>
				</div>
			))}
		</div>
	);
}

export function IntegrationCode() {
	return (
		<CodeBlock
			code={`// Good pattern: prepare() when data arrives\nfunction onDataLoaded(items) {\n  preparedItems = items.map(item => ({\n    ...item,\n    prepared: prepare(item.text, '16px Inter'),\n  }));\n  updateLayout(containerWidth);\n}\n\n// Good pattern: layout() on every resize\nfunction updateLayout(width) {\n  offsets = [];\n  let y = 0;\n  for (const item of preparedItems) {\n    offsets.push(y);\n    y += layout(item.prepared, width, 24).height + GAP;\n  }\n  totalHeight = y;\n}`}
			language="javascript"
		/>
	);
}

export function MdxVerdictBox() {
	return (
		<VerdictBox title="The short answer">
			<p className={styles.paragraph}>
				If you&apos;re building virtual scrolling, Canvas/SVG text rendering, chat UIs, or any layout that
				requires knowing text height before mounting &mdash; <strong>yes, pretext is the best tool available.</strong>{' '}
				The performance lead over DOM measurement is real and substantial, the accuracy is impressive,
				and the API surface is small and well-designed.
			</p>
			<p className={styles.paragraph}>
				If you&apos;re building standard content pages, forms, or anything where the browser&apos;s own layout
				engine can do the work &mdash; <strong>don&apos;t reach for pretext.</strong> The additional complexity,
				font-sync discipline, and CSS-mode restrictions aren&apos;t worth it when CSS already has the answer.
			</p>
		</VerdictBox>
	);
}
