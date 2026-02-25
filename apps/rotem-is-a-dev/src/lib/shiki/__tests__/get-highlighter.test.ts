const mockHighlighterInstance = {
	codeToTokensBase: jest.fn(),
	codeToHtml: jest.fn(),
};

const mockCreateHighlighterCore = jest.fn().mockResolvedValue(mockHighlighterInstance);
const mockCreateOnigurumaEngine = jest.fn().mockReturnValue('mock-engine');

jest.mock('shiki/core', () => ({
	createHighlighterCore: (...args: unknown[]) => mockCreateHighlighterCore(...args),
}));

jest.mock('shiki/engine/oniguruma', () => ({
	createOnigurumaEngine: (...args: unknown[]) => mockCreateOnigurumaEngine(...args),
}));

jest.mock('shiki/themes/night-owl', () => ({ default: { name: 'night-owl' } }), { virtual: true });
jest.mock('shiki/langs/javascript', () => ({ default: { name: 'javascript' } }), { virtual: true });
jest.mock('shiki/langs/typescript', () => ({ default: { name: 'typescript' } }), { virtual: true });
jest.mock('shiki/langs/json', () => ({ default: { name: 'json' } }), { virtual: true });
jest.mock('shiki/wasm', () => ({ default: 'mock-wasm' }), { virtual: true });

describe('getHighlighter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetModules();
	});

	it('creates a highlighter instance', async () => {
		const { getHighlighter } = await import('../get-highlighter');
		const highlighter = await getHighlighter();

		expect(highlighter).toBe(mockHighlighterInstance);
		expect(mockCreateHighlighterCore).toHaveBeenCalledTimes(1);
	});

	it('passes themes, langs, and engine to createHighlighterCore', async () => {
		const { getHighlighter } = await import('../get-highlighter');
		await getHighlighter();

		const callArgs = mockCreateHighlighterCore.mock.calls[0][0];
		expect(callArgs).toHaveProperty('themes');
		expect(callArgs).toHaveProperty('langs');
		expect(callArgs).toHaveProperty('engine');
		expect(callArgs.themes).toHaveLength(1);
		expect(callArgs.langs).toHaveLength(3);
	});

	it('calls createOnigurumaEngine with shiki wasm', async () => {
		const { getHighlighter } = await import('../get-highlighter');
		await getHighlighter();

		expect(mockCreateOnigurumaEngine).toHaveBeenCalledTimes(1);
	});

	it('returns the same instance on subsequent calls (singleton pattern)', async () => {
		const { getHighlighter } = await import('../get-highlighter');
		const firstCall = await getHighlighter();
		const secondCall = await getHighlighter();

		expect(firstCall).toBe(secondCall);
		expect(mockCreateHighlighterCore).toHaveBeenCalledTimes(1);
	});

	it('returns the same promise when called concurrently', async () => {
		const { getHighlighter } = await import('../get-highlighter');
		const [result1, result2, result3] = await Promise.all([
			getHighlighter(),
			getHighlighter(),
			getHighlighter(),
		]);

		expect(result1).toBe(result2);
		expect(result2).toBe(result3);
		expect(mockCreateHighlighterCore).toHaveBeenCalledTimes(1);
	});
});
