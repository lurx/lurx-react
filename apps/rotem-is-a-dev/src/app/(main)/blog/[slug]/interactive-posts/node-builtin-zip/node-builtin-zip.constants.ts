import type { BenchRow, BenchSeries } from './node-builtin-zip.types';

export const BENCH_SOURCE = 'First-hand benchmark, Node 26.8.1 on an Apple M4 Pro, 2026-09-07. Median of 11 runs, each in a fresh process.';

export const READ_ALL_SERIES = [
	{ key: 'manySmall', name: 'many-small (2,000 files)', color: 'var(--orange)' },
	{ key: 'realistic', name: 'realistic (966 files)', color: 'var(--teal)' },
] as const satisfies readonly BenchSeries[];

export const READ_ALL_ROWS = [
	{ label: 'ZipBuffer (built-in)', manySmall: 13.26, realistic: 10.03 },
	{ label: 'adm-zip', manySmall: 32.41, realistic: 24.06 },
	{ label: 'ZipFile (built-in)', manySmall: 124.48, realistic: 57.37 },
	{ label: 'yauzl', manySmall: 125.42, realistic: 65.99 },
	{ label: 'jszip', manySmall: 157.54, realistic: 90.76 },
] as const satisfies readonly BenchRow[];

export const WRITE_SERIES = [
	{ key: 'fewLarge', name: 'few-large (4 x 25 MB)', color: 'var(--purple)' },
] as const satisfies readonly BenchSeries[];

export const WRITE_ROWS = [
	{ label: 'ZipBuffer (built-in)', fewLarge: 2087 },
	{ label: 'ZipFile (built-in)', fewLarge: 2129 },
	{ label: 'archiver', fewLarge: 2185 },
	{ label: 'adm-zip', fewLarge: 2243 },
	{ label: 'jszip', fewLarge: 4663 },
] as const satisfies readonly BenchRow[];
