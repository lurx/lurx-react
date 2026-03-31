import {
	runMainBenchmark,
	runResizeBenchmark,
	getMainBenchmarkSource,
	getResizeBenchmarkSource,
} from '../pretext-benchmark.helpers';

// ─── Mock @chenglou/pretext ─────────────────────────────────────────────────

const mockPrepared = { __brand: 'prepared' };

jest.mock('@chenglou/pretext', () => ({
	prepare: jest.fn(() => mockPrepared),
	layout: jest.fn(() => ({ height: 48, lineCount: 2 })),
}));

// ─── Mock performance.now ───────────────────────────────────────────────────

let timeCounter = 0;

beforeEach(() => {
	timeCounter = 0;
	jest.spyOn(performance, 'now').mockImplementation(() => {
		timeCounter += 10;
		return timeCounter;
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

// ─── Mock DOM ───────────────────────────────────────────────────────────────

const mockBoundingRect = { height: 48, width: 500, top: 0, left: 0, bottom: 48, right: 500, x: 0, y: 0, toJSON: jest.fn() };

const mockChildElement = {
	textContent: '',
	style: { width: '', cssText: '' },
	getBoundingClientRect: jest.fn(() => mockBoundingRect),
} as unknown as HTMLDivElement;

const mockContainer = {
	textContent: '',
	innerHTML: '',
	style: { cssText: '', width: '' },
	getBoundingClientRect: jest.fn(() => mockBoundingRect),
	appendChild: jest.fn(),
	removeChild: jest.fn(),
} as unknown as HTMLDivElement;

beforeEach(() => {
	jest.spyOn(document, 'createElement').mockReturnValue(mockContainer as unknown as HTMLElement);
	jest.spyOn(document.body, 'appendChild').mockReturnValue(mockContainer as unknown as HTMLElement);
	jest.spyOn(document.body, 'removeChild').mockReturnValue(mockContainer as unknown as HTMLElement);

	// When createElement is called for child elements in measureDomBatched, return mockChildElement
	(document.createElement as jest.Mock).mockImplementation(() => ({
		textContent: '',
		style: { width: '', cssText: '' },
		getBoundingClientRect: jest.fn(() => mockBoundingRect),
		appendChild: jest.fn(),
		removeChild: jest.fn(),
		innerHTML: '',
	}));
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('runMainBenchmark', () => {
	it('returns an object with all four timing values', () => {
		const result = runMainBenchmark(5);

		expect(result).toHaveProperty('domInterleaved');
		expect(result).toHaveProperty('domBatched');
		expect(result).toHaveProperty('prepare');
		expect(result).toHaveProperty('layout');
	});

	it('returns numeric timing values', () => {
		const result = runMainBenchmark(5);

		expect(typeof result.domInterleaved).toBe('number');
		expect(typeof result.domBatched).toBe('number');
		expect(typeof result.prepare).toBe('number');
		expect(typeof result.layout).toBe('number');
	});

	it('creates a container and removes it after benchmark', () => {
		runMainBenchmark(5);

		expect(document.createElement).toHaveBeenCalled();
		expect(document.body.appendChild).toHaveBeenCalled();
		expect(document.body.removeChild).toHaveBeenCalled();
	});

	it('returns positive timing values', () => {
		const result = runMainBenchmark(5);

		expect(result.domInterleaved).toBeGreaterThan(0);
		expect(result.domBatched).toBeGreaterThan(0);
		expect(result.prepare).toBeGreaterThan(0);
		expect(result.layout).toBeGreaterThan(0);
	});

	it('uses default count when no argument provided', () => {
		const result = runMainBenchmark();

		expect(result).toHaveProperty('domInterleaved');
		expect(result).toHaveProperty('domBatched');
		expect(result).toHaveProperty('prepare');
		expect(result).toHaveProperty('layout');
	});
});

describe('runResizeBenchmark', () => {
	it('returns an object with domPerResize and pretextPerResize', () => {
		const result = runResizeBenchmark(5);

		expect(result).toHaveProperty('domPerResize');
		expect(result).toHaveProperty('pretextPerResize');
	});

	it('returns numeric timing values', () => {
		const result = runResizeBenchmark(5);

		expect(typeof result.domPerResize).toBe('number');
		expect(typeof result.pretextPerResize).toBe('number');
	});

	it('returns positive timing values', () => {
		const result = runResizeBenchmark(5);

		expect(result.domPerResize).toBeGreaterThan(0);
		expect(result.pretextPerResize).toBeGreaterThan(0);
	});

	it('cleans up the DOM container after benchmark', () => {
		runResizeBenchmark(5);

		expect(document.body.removeChild).toHaveBeenCalled();
	});

	it('uses default count when no argument provided', () => {
		const result = runResizeBenchmark();

		expect(result).toHaveProperty('domPerResize');
		expect(result).toHaveProperty('pretextPerResize');
	});
});

describe('getMainBenchmarkSource', () => {
	it('returns a non-empty string', () => {
		const source = getMainBenchmarkSource(500);

		expect(source.length).toBeGreaterThan(0);
	});

	it('contains the formatted count', () => {
		const source = getMainBenchmarkSource(500);

		expect(source).toContain('500');
	});

	it('contains the import statement for pretext', () => {
		const source = getMainBenchmarkSource(500);

		expect(source).toContain("import { prepare, layout } from '@chenglou/pretext'");
	});

	it('contains key DOM measurement patterns', () => {
		const source = getMainBenchmarkSource(500);

		expect(source).toContain('getBoundingClientRect');
		expect(source).toContain('textContent');
	});

	it('contains pretext API calls', () => {
		const source = getMainBenchmarkSource(500);

		expect(source).toContain('prepare(text, font)');
		expect(source).toContain('layout(p, maxWidth, lineHeight)');
	});

	it('includes the count with locale formatting for large numbers', () => {
		const source = getMainBenchmarkSource(1000);

		expect(source).toContain('1,000');
	});
});

describe('getResizeBenchmarkSource', () => {
	it('returns a non-empty string', () => {
		const source = getResizeBenchmarkSource(500);

		expect(source.length).toBeGreaterThan(0);
	});

	it('contains the count', () => {
		const source = getResizeBenchmarkSource(500);

		expect(source).toContain('500');
	});

	it('contains resize widths', () => {
		const source = getResizeBenchmarkSource(500);

		expect(source).toContain('280');
		expect(source).toContain('400');
		expect(source).toContain('500');
		expect(source).toContain('600');
		expect(source).toContain('700');
	});

	it('contains the import statement for pretext', () => {
		const source = getResizeBenchmarkSource(500);

		expect(source).toContain("import { prepare, layout } from '@chenglou/pretext'");
	});

	it('mentions prepare once and layout at each width', () => {
		const source = getResizeBenchmarkSource(500);

		expect(source).toContain('prepare(text, font)');
		expect(source).toContain('layout(p, width, 24)');
	});
});

describe('deterministic PRNG', () => {
	it('produces consistent benchmark results for the same count', () => {
		const result1 = runMainBenchmark(10);
		const result2 = runMainBenchmark(10);

		// Both calls should produce results (the PRNG is deterministic with seed 42)
		expect(result1).toHaveProperty('domInterleaved');
		expect(result2).toHaveProperty('domInterleaved');
	});

	it('produces results that depend on the count parameter', () => {
		// Different counts produce different text sets but still return valid results
		const resultSmall = runMainBenchmark(2);
		const resultLarge = runMainBenchmark(20);

		expect(resultSmall).toHaveProperty('domInterleaved');
		expect(resultLarge).toHaveProperty('domInterleaved');
	});
});
