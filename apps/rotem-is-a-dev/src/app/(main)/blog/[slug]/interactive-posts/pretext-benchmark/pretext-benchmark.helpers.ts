import { prepare, layout, type PreparedText } from '@chenglou/pretext';

const SAMPLE_TEXTS = [
	'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.',
	'In the beginning, there was nothing. Then there was everything. The universe expanded rapidly, filling the void with matter and energy.',
	'JavaScript is a versatile programming language that powers the modern web. From simple scripts to complex applications, it handles them all.',
	'The art of typography has evolved significantly since Gutenberg. Today, digital fonts allow unprecedented control over text presentation.',
	'Performance optimization in web applications often comes down to understanding the browser rendering pipeline and avoiding unnecessary work.',
	'React components should be small, focused, and composable. Each component should do one thing well and delegate the rest.',
	'CSS Grid and Flexbox have revolutionized web layout. Gone are the days of float-based layouts and clearfix hacks.',
	'The debate between server-side and client-side rendering continues. Each approach has trade-offs in performance, SEO, and user experience.',
	'Testing is not just about catching bugs. It documents behavior, enables refactoring, and gives confidence in deployments.',
	'Accessibility is not an afterthought. Building inclusive interfaces from the start is both ethical and practical.',
];

const BENCH_FONT = '16px Inter, sans-serif';
const BENCH_LINE_HEIGHT = 24;
const BENCH_COUNT = 500;
const BENCH_WIDTH = 500;
const RESIZE_WIDTHS = [280, 400, 500, 600, 700];

/**
 * Deterministic seeded PRNG (mulberry32).
 * Produces reproducible benchmarks and avoids SonarQube Math.random() hotspots.
 */
function mulberry32(seed: number): () => number {
	let state = seed | 0;

	return () => {
		state = (state + 0x6D2B79F5) | 0;
		let hash = Math.imul(state ^ (state >>> 15), 1 | state);
		hash = (hash + Math.imul(hash ^ (hash >>> 7), 61 | hash)) ^ hash;

		return ((hash ^ (hash >>> 14)) >>> 0) / 4294967296;
	};
}

function generateTexts(count: number): string[] {
	const rand = mulberry32(42);
	const texts: string[] = [];

	for (let idx = 0; idx < count; idx++) {
		const numSentences = 2 + Math.floor(rand() * 6);
		let text = '';

		for (let si = 0; si < numSentences; si++) {
			text += SAMPLE_TEXTS[Math.floor(rand() * SAMPLE_TEXTS.length)] + ' ';
		}

		texts.push(text.trim());
	}

	return texts;
}

// ─── DOM Measurement ─────────────────────────────────────────────────────────

function createMeasureContainer(font: string): HTMLDivElement {
	const container = document.createElement('div');
	container.style.cssText = `position:absolute;visibility:hidden;font:${font}`;
	document.body.appendChild(container);

	return container;
}

function measureDomInterleaved(texts: string[], container: HTMLDivElement, width: number): number {
	const start = performance.now();

	for (const text of texts) {
		container.style.width = `${width}px`;
		container.textContent = text;
		void container.getBoundingClientRect().height;
	}

	return performance.now() - start;
}

function measureDomBatched(texts: string[], container: HTMLDivElement, width: number): number {
	const elements: HTMLDivElement[] = [];
	const start = performance.now();

	container.style.width = `${width}px`;

	for (const text of texts) {
		const el = document.createElement('div');
		el.textContent = text;
		container.appendChild(el);
		elements.push(el);
	}

	for (const el of elements) {
		void el.getBoundingClientRect().height;
	}

	container.innerHTML = '';

	return performance.now() - start;
}

// ─── Pretext Measurement ─────────────────────────────────────────────────────

function measurePretextPrepare(texts: string[], font: string): { prepared: PreparedText[]; elapsed: number } {
	const start = performance.now();
	const prepared = texts.map(text => prepare(text, font));
	const elapsed = performance.now() - start;

	return { prepared, elapsed };
}

function measurePretextLayout(prepared: PreparedText[], maxWidth: number, lineHeight: number): number {
	const start = performance.now();

	for (const item of prepared) {
		layout(item, maxWidth, lineHeight);
	}

	return performance.now() - start;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export type BenchmarkResults = {
	domInterleaved: number;
	domBatched: number;
	prepare: number;
	layout: number;
};

export type ResizeResults = {
	domPerResize: number;
	pretextPerResize: number;
};

export function runMainBenchmark(count: number = BENCH_COUNT): BenchmarkResults {
	const texts = generateTexts(count);
	const container = createMeasureContainer(BENCH_FONT);

	const domInterleaved = measureDomInterleaved(texts, container, BENCH_WIDTH);
	container.innerHTML = '';

	const domBatched = measureDomBatched(texts, container, BENCH_WIDTH);

	const { prepared, elapsed: prepareTime } = measurePretextPrepare(texts, BENCH_FONT);
	const layoutTime = measurePretextLayout(prepared, BENCH_WIDTH, BENCH_LINE_HEIGHT);

	document.body.removeChild(container);

	return { domInterleaved, domBatched, prepare: prepareTime, layout: layoutTime };
}

export function runResizeBenchmark(count: number = BENCH_COUNT): ResizeResults {
	const texts = generateTexts(count);
	const container = createMeasureContainer(BENCH_FONT);

	let domTotal = 0;

	for (const targetWidth of RESIZE_WIDTHS) {
		domTotal += measureDomBatched(texts, container, targetWidth);
	}

	const { prepared } = measurePretextPrepare(texts, BENCH_FONT);
	let pretextTotal = 0;

	for (const targetWidth of RESIZE_WIDTHS) {
		pretextTotal += measurePretextLayout(prepared, targetWidth, BENCH_LINE_HEIGHT);
	}

	document.body.removeChild(container);

	return {
		domPerResize: domTotal / RESIZE_WIDTHS.length,
		pretextPerResize: pretextTotal / RESIZE_WIDTHS.length,
	};
}

// ─── Source Code (for View Source toggle) ────────────────────────────────────

export function getMainBenchmarkSource(count: number): string {
	return `import { prepare, layout } from '@chenglou/pretext';

// Generate ${count.toLocaleString()} paragraphs, 2-8 sentences each
const texts = generateTexts(${count});
const font = '16px Inter, sans-serif';
const maxWidth = 500;
const lineHeight = 24;

// ── DOM Interleaved (worst case) ──
// Write + read for each element = forced reflow every iteration
for (const text of texts) {
  container.style.width = maxWidth + 'px';
  container.textContent = text;
  void container.getBoundingClientRect().height; // reflow!
}

// ── DOM Batched (best case) ──
// All writes first, then all reads = single reflow
container.style.width = maxWidth + 'px';
const elements = texts.map(text => {
  const el = document.createElement('div');
  el.textContent = text;
  container.appendChild(el);
  return el;
});
elements.forEach(el => el.getBoundingClientRect().height);

// ── Pretext prepare() ── (one-time cost)
// Uses canvas measureText() internally — no DOM reflow
const prepared = texts.map(text => prepare(text, font));

// ── Pretext layout() ── (hot path, called on every resize)
// Pure arithmetic over cached segment widths — no canvas, no DOM
prepared.forEach(p => layout(p, maxWidth, lineHeight));`;
}

export function getResizeBenchmarkSource(count: number): string {
	return `import { prepare, layout } from '@chenglou/pretext';

const texts = generateTexts(${count});
const font = '16px Inter, sans-serif';
const widths = [280, 400, 500, 600, 700]; // simulate 5 resize events

// ── DOM: must re-measure at every new width ──
for (const width of widths) {
  // Batch: write all elements, then read all heights
  container.style.width = width + 'px';
  const elements = texts.map(text => {
    const el = document.createElement('div');
    el.textContent = text;
    container.appendChild(el);
    return el;
  });
  elements.forEach(el => el.getBoundingClientRect().height);
  container.innerHTML = '';
}

// ── Pretext: prepare once, layout at each width ──
const prepared = texts.map(text => prepare(text, font));
for (const width of widths) {
  // Pure arithmetic — no canvas, no DOM
  prepared.forEach(p => layout(p, width, 24));
}`;
}
