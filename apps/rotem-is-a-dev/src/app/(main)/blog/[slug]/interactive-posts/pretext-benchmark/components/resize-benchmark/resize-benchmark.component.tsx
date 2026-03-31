'use client';

import { useState, useCallback } from 'react';
import type { ResizeResults } from '../../pretext-benchmark.helpers';
import { runResizeBenchmark, getResizeBenchmarkSource } from '../../pretext-benchmark.helpers';
import type { BenchmarkBarRow, ItemCount } from '../benchmark-widget/benchmark-widget.types';
import { BenchmarkWidget } from '../benchmark-widget';

const EMPTY_ROWS: BenchmarkBarRow[] = [
	{ label: 'DOM (per resize event)', value: '\u2014', percentage: 0, color: '#f87171' },
	{ label: 'Pretext layout() (per resize)', value: '\u2014', percentage: 0, color: '#4ade80' },
];

function formatMs(ms: number): string {
	return ms < 1 ? `${(ms * 1000).toFixed(0)}\u00B5s` : `${ms.toFixed(2)}ms`;
}

function toResizeRows(results: ResizeResults): BenchmarkBarRow[] {
	const max = Math.max(results.domPerResize, results.pretextPerResize);
	const pct = (value: number) => Math.max(2, (value / max) * 100);

	return [
		{ label: 'DOM (per resize event)', value: formatMs(results.domPerResize), percentage: pct(results.domPerResize), color: '#f87171' },
		{ label: 'Pretext layout() (per resize)', value: formatMs(results.pretextPerResize), percentage: pct(results.pretextPerResize), color: '#4ade80' },
	];
}

export function ResizeBenchmark() {
	const [rows, setRows] = useState(EMPTY_ROWS);
	const [status, setStatus] = useState('Run the main benchmark first.');
	const [isRunning, setIsRunning] = useState(false);
	const [itemCount, setItemCount] = useState<ItemCount>(500);
	const [showSource, setShowSource] = useState(false);

	const handleRun = useCallback((count: ItemCount) => {
		setIsRunning(true);
		setStatus(`Running resize simulation with ${count.toLocaleString()} items\u2026`);

		requestAnimationFrame(() => {
			setTimeout(() => {
				const results = runResizeBenchmark(count);
				setRows(toResizeRows(results));
				setStatus(`Done (${count.toLocaleString()} items). DOM: ${formatMs(results.domPerResize)}/resize | Pretext: ${formatMs(results.pretextPerResize)}/resize`);
				setIsRunning(false);
			}, 50);
		});
	}, []);

	const toggleSource = useCallback(() => setShowSource(prev => !prev), []);

	return (
		<BenchmarkWidget
			title="Resize Simulation \u2014 5 width changes"
			rows={rows}
			status={status}
			onRunAction={handleRun}
			isRunning={isRunning}
			sourceCode={getResizeBenchmarkSource(itemCount)}
			itemCount={itemCount}
			onItemCountChangeAction={setItemCount}
			showSource={showSource}
			onToggleSourceAction={toggleSource}
		/>
	);
}
