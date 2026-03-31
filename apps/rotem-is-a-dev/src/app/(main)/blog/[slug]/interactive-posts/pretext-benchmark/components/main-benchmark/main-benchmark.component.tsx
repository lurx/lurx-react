'use client';

import { useState, useCallback } from 'react';
import type { BenchmarkResults } from '../../pretext-benchmark.helpers';
import { runMainBenchmark, getMainBenchmarkSource } from '../../pretext-benchmark.helpers';
import type { BenchmarkBarRow, ItemCount } from '../benchmark-widget/benchmark-widget.types';
import { BenchmarkWidget } from '../benchmark-widget';

const EMPTY_ROWS: BenchmarkBarRow[] = [
	{ label: 'DOM interleaved (worst)', value: '\u2014', percentage: 0, color: '#f87171' },
	{ label: 'DOM batched (best case)', value: '\u2014', percentage: 0, color: '#fb923c' },
	{ label: 'Pretext prepare() \u2014 once', value: '\u2014', percentage: 0, color: '#5aedcd' },
	{ label: 'Pretext layout() \u2014 hot path', value: '\u2014', percentage: 0, color: '#4ade80' },
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

export function MainBenchmark() {
	const [rows, setRows] = useState(EMPTY_ROWS);
	const [status, setStatus] = useState('Click Run to start. Tests run sequentially to avoid interference.');
	const [isRunning, setIsRunning] = useState(false);
	const [itemCount, setItemCount] = useState<ItemCount>(500);
	const [showSource, setShowSource] = useState(false);

	const handleRun = useCallback((count: ItemCount) => {
		setIsRunning(true);
		setStatus(`Running benchmark with ${count.toLocaleString()} items\u2026`);

		requestAnimationFrame(() => {
			setTimeout(() => {
				const results = runMainBenchmark(count);
				setRows(toBarRows(results));
				setStatus(`Done (${count.toLocaleString()} items). DOM interleaved: ${formatMs(results.domInterleaved)} | Pretext layout: ${formatMs(results.layout)}`);
				setIsRunning(false);
			}, 50);
		});
	}, []);

	const toggleSource = useCallback(() => setShowSource(prev => !prev), []);

	return (
		<BenchmarkWidget
			title="Text Height Prediction"
			description="Mixed paragraphs, 2–8 sentences each. Resize simulation: layout computed at 5 different widths (280–700px)."
			rows={rows}
			status={status}
			onRunAction={handleRun}
			isRunning={isRunning}
			sourceCode={getMainBenchmarkSource(itemCount)}
			itemCount={itemCount}
			onItemCountChangeAction={setItemCount}
			showSource={showSource}
			onToggleSourceAction={toggleSource}
		/>
	);
}
