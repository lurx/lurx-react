'use client';

import { useState, useCallback, useRef, createContext, useContext } from 'react';
import { useMDXComponent } from '@/lib/mdx';
import { CodeBlock } from '@/app/components';
import type { ScenarioId } from './pretext-benchmark.types';
import type { BenchmarkResults, ResizeResults } from './pretext-benchmark.helpers';
import { runMainBenchmark, runResizeBenchmark, getMainBenchmarkSource, getResizeBenchmarkSource } from './pretext-benchmark.helpers';
import { IMPOSSIBLE_THINGS } from './pretext-benchmark.constants';
import type { BenchmarkBarRow, ItemCount } from './components/benchmark-widget/benchmark-widget.types';
import { BenchmarkWidget, DecisionTable, ReflowViz, ScenarioSwitcher, VerdictBox } from './components';
import blogStyles from '../../blog-post.module.scss';
import styles from './pretext-benchmark.module.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

type PretextBenchmarkMdxProps = {
	code?: string;
};

// ─── Benchmark Helpers ───────────────────────────────────────────────────────

const EMPTY_ROWS: BenchmarkBarRow[] = [
	{ label: 'DOM interleaved (worst)', value: '\u2014', percentage: 0, color: '#f87171' },
	{ label: 'DOM batched (best case)', value: '\u2014', percentage: 0, color: '#fb923c' },
	{ label: 'Pretext prepare() \u2014 once', value: '\u2014', percentage: 0, color: '#5aedcd' },
	{ label: 'Pretext layout() \u2014 hot path', value: '\u2014', percentage: 0, color: '#4ade80' },
];

const EMPTY_RESIZE_ROWS: BenchmarkBarRow[] = [
	{ label: 'DOM (per resize event)', value: '\u2014', percentage: 0, color: '#f87171' },
	{ label: 'Pretext layout() (per resize)', value: '\u2014', percentage: 0, color: '#4ade80' },
];

function formatMs(ms: number): string {
	return ms < 1 ? `${(ms * 1000).toFixed(0)}\u00B5s` : `${ms.toFixed(2)}ms`;
}

function toBarRows(results: BenchmarkResults): BenchmarkBarRow[] {
	const max = Math.max(results.domInterleaved, results.domBatched, results.prepare, results.layout);
	const pct = (value: number) => Math.max(2, (value / max) * 100);

	return [
		{ label: 'DOM interleaved (worst)', value: formatMs(results.domInterleaved), percentage: pct(results.domInterleaved), color: '#f87171' },
		{ label: 'DOM batched (best case)', value: formatMs(results.domBatched), percentage: pct(results.domBatched), color: '#fb923c' },
		{ label: 'Pretext prepare() \u2014 once', value: formatMs(results.prepare), percentage: pct(results.prepare), color: '#5aedcd' },
		{ label: 'Pretext layout() \u2014 hot path', value: formatMs(results.layout), percentage: pct(results.layout), color: '#4ade80' },
	];
}

function toResizeRows(results: ResizeResults): BenchmarkBarRow[] {
	const max = Math.max(results.domPerResize, results.pretextPerResize);
	const pct = (value: number) => Math.max(2, (value / max) * 100);

	return [
		{ label: 'DOM (per resize event)', value: formatMs(results.domPerResize), percentage: pct(results.domPerResize), color: '#f87171' },
		{ label: 'Pretext layout() (per resize)', value: formatMs(results.pretextPerResize), percentage: pct(results.pretextPerResize), color: '#4ade80' },
	];
}

// ─── MDX Component Wrappers ─────────────────────────────────────────────────

function CodeCompare() {
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

function StatsRow() {
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

function ImpossibleThingsGrid() {
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

function IntegrationCode() {
	return (
		<CodeBlock
			code={`// Good pattern: prepare() when data arrives\nfunction onDataLoaded(items) {\n  preparedItems = items.map(item => ({\n    ...item,\n    prepared: prepare(item.text, '16px Inter'),\n  }));\n  updateLayout(containerWidth);\n}\n\n// Good pattern: layout() on every resize\nfunction updateLayout(width) {\n  offsets = [];\n  let y = 0;\n  for (const item of preparedItems) {\n    offsets.push(y);\n    y += layout(item.prepared, width, 24).height + GAP;\n  }\n  totalHeight = y;\n}`}
			language="javascript"
		/>
	);
}

function MdxVerdictBox() {
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

// ─── Main MDX Renderer ──────────────────────────────────────────────────────

// ─── Render-tick context: forces bridged components to re-render ─────────────

const RenderTickContext = createContext(0);

function useRenderTick() {
	useContext(RenderTickContext);
}

// ─── Render-bridge: lets stable MDX components read latest state via refs ────

type BenchState = {
	mainRows: BenchmarkBarRow[];
	mainStatus: string;
	isRunningMain: boolean;
	mainItemCount: ItemCount;
	showMainSource: boolean;
	resizeRows: BenchmarkBarRow[];
	resizeStatus: string;
	isRunningResize: boolean;
	resizeItemCount: ItemCount;
	showResizeSource: boolean;
	activeScenario: ScenarioId;
	handleRunMain: (count: ItemCount) => void;
	handleRunResize: (count: ItemCount) => void;
	setMainItemCount: (count: ItemCount) => void;
	setResizeItemCount: (count: ItemCount) => void;
	toggleMainSource: () => void;
	toggleResizeSource: () => void;
	setActiveScenario: (id: ScenarioId) => void;
};

function useLatestRef<T>(value: T) {
	const ref = useRef(value);
	ref.current = value;

	return ref;
}

/**
 * Bridge component that reads from a ref on every render.
 * Its identity never changes, so MDX never remounts it.
 */
function createBridgedMainBenchmark(stateRef: React.RefObject<BenchState>) {
	return function BridgedMainBenchmark() {
		useRenderTick();
		const st = stateRef.current;

		return (
			<BenchmarkWidget
				title={"Text Height Prediction"}
				description={"Mixed paragraphs, 2\u20138 sentences each. Resize simulation: layout computed at 5 different widths (280\u2013700px)."}
				rows={st.mainRows}
				status={st.mainStatus}
				onRunAction={st.handleRunMain}
				isRunning={st.isRunningMain}
				sourceCode={getMainBenchmarkSource(st.mainItemCount)}
				itemCount={st.mainItemCount}
				onItemCountChangeAction={st.setMainItemCount}
				showSource={st.showMainSource}
				onToggleSourceAction={st.toggleMainSource}
			/>
		);
	};
}

function createBridgedResizeBenchmark(stateRef: React.RefObject<BenchState>) {
	return function BridgedResizeBenchmark() {
		useRenderTick();
		const st = stateRef.current;

		return (
			<BenchmarkWidget
				title={"Resize Simulation \u2014 5 width changes"}
				rows={st.resizeRows}
				status={st.resizeStatus}
				onRunAction={st.handleRunResize}
				isRunning={st.isRunningResize}
				sourceCode={getResizeBenchmarkSource(st.resizeItemCount)}
				itemCount={st.resizeItemCount}
				onItemCountChangeAction={st.setResizeItemCount}
				showSource={st.showResizeSource}
				onToggleSourceAction={st.toggleResizeSource}
			/>
		);
	};
}

function createBridgedScenarioSwitcher(stateRef: React.RefObject<BenchState>) {
	return function BridgedScenarioSwitcher() {
		useRenderTick();
		const st = stateRef.current;

		return (
			<ScenarioSwitcher activeScenario={st.activeScenario} onSelectAction={st.setActiveScenario} />
		);
	};
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function PretextBenchmarkMdx({ code }: Readonly<PretextBenchmarkMdxProps>) {
	const [activeScenario, setActiveScenario] = useState<ScenarioId>('virtual');
	const [mainRows, setMainRows] = useState(EMPTY_ROWS);
	const [resizeRows, setResizeRows] = useState(EMPTY_RESIZE_ROWS);
	const [mainStatus, setMainStatus] = useState('Click Run to start. Tests run sequentially to avoid interference.');
	const [resizeStatus, setResizeStatus] = useState('Run the main benchmark first.');
	const [isRunningMain, setIsRunningMain] = useState(false);
	const [isRunningResize, setIsRunningResize] = useState(false);
	const [mainItemCount, setMainItemCount] = useState<ItemCount>(500);
	const [resizeItemCount, setResizeItemCount] = useState<ItemCount>(500);
	const [showMainSource, setShowMainSource] = useState(false);
	const [showResizeSource, setShowResizeSource] = useState(false);

	const handleRunMain = useCallback((count: ItemCount) => {
		setIsRunningMain(true);
		setMainStatus(`Running benchmark with ${count.toLocaleString()} items\u2026`);

		requestAnimationFrame(() => {
			setTimeout(() => {
				const results = runMainBenchmark(count);
				setMainRows(toBarRows(results));
				setMainStatus(`Done (${count.toLocaleString()} items). DOM interleaved: ${formatMs(results.domInterleaved)} | Pretext layout: ${formatMs(results.layout)}`);
				setIsRunningMain(false);
				setResizeStatus('Ready to run.');
			}, 50);
		});
	}, []);

	const handleRunResize = useCallback((count: ItemCount) => {
		setIsRunningResize(true);
		setResizeStatus(`Running resize simulation with ${count.toLocaleString()} items\u2026`);

		requestAnimationFrame(() => {
			setTimeout(() => {
				const results = runResizeBenchmark(count);
				setResizeRows(toResizeRows(results));
				setResizeStatus(`Done (${count.toLocaleString()} items). DOM: ${formatMs(results.domPerResize)}/resize | Pretext: ${formatMs(results.pretextPerResize)}/resize`);
				setIsRunningResize(false);
			}, 50);
		});
	}, []);

	const toggleMainSource = useCallback(() => setShowMainSource(prev => !prev), []);
	const toggleResizeSource = useCallback(() => setShowResizeSource(prev => !prev), []);

	// Pack all state into a ref so bridged components can read latest values
	// without changing their identity
	const stateRef = useLatestRef<BenchState>({
		mainRows, mainStatus, isRunningMain, mainItemCount, showMainSource,
		resizeRows, resizeStatus, isRunningResize, resizeItemCount, showResizeSource,
		activeScenario,
		handleRunMain, handleRunResize,
		setMainItemCount, setResizeItemCount,
		toggleMainSource, toggleResizeSource,
		setActiveScenario,
	});

	// These are created once and never change — MDX never remounts them
	const [mdxComponents] = useState(() => ({
		ReflowViz,
		CodeCompare,
		StatsRow,
		MainBenchmark: createBridgedMainBenchmark(stateRef),
		ResizeBenchmark: createBridgedResizeBenchmark(stateRef),
		ScenarioSwitcher: createBridgedScenarioSwitcher(stateRef),
		ImpossibleThingsGrid,
		DecisionTable,
		IntegrationCode,
		VerdictBox: MdxVerdictBox,
	}));

	const MDXContent = useMDXComponent(code ?? '');

	// Increment on every render so bridged components re-render via context
	const renderTickRef = useRef(0);
	renderTickRef.current += 1;

	if (!code) return null;

	return (
		<RenderTickContext.Provider value={renderTickRef.current}>
			<div className={`${blogStyles.content} ${styles.post}`}>
				<MDXContent components={mdxComponents} />
			</div>
		</RenderTickContext.Provider>
	);
}
