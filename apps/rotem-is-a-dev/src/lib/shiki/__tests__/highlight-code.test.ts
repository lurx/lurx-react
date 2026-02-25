import type { ThemedToken } from 'shiki/core';

const mockCodeToTokensBase = jest.fn();

jest.mock('../get-highlighter', () => ({
	getHighlighter: jest.fn().mockResolvedValue({
		codeToTokensBase: (...args: unknown[]) => mockCodeToTokensBase(...args),
	}),
}));

import { highlightCode } from '../highlight-code';
import { getHighlighter } from '../get-highlighter';

describe('highlightCode', () => {
	const mockTokenLine1: ThemedToken[] = [
		{ content: 'const', color: '#C792EA', offset: 0 },
		{ content: ' x', color: '#D6DEEB', offset: 6 },
	];
	const mockTokenLine2: ThemedToken[] = [
		{ content: '  = 1;', color: '#D6DEEB', offset: 0 },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockCodeToTokensBase.mockReturnValue([mockTokenLine1, mockTokenLine2]);
	});

	it('calls getHighlighter to obtain a highlighter instance', async () => {
		await highlightCode({ code: 'const x = 1;', language: 'typescript' });

		expect(getHighlighter).toHaveBeenCalledTimes(1);
	});

	it('calls codeToTokensBase with the provided code, language, and night-owl theme', async () => {
		await highlightCode({ code: 'const x = 1;', language: 'typescript' });

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('const x = 1;', {
			lang: 'typescript',
			theme: 'night-owl',
		});
	});

	it('transforms token lines into ShikiLine objects', async () => {
		const result = await highlightCode({ code: 'const x = 1;', language: 'typescript' });

		expect(result).toEqual([
			{ tokens: mockTokenLine1 },
			{ tokens: mockTokenLine2 },
		]);
	});

	it('returns an empty array when code produces no token lines', async () => {
		mockCodeToTokensBase.mockReturnValue([]);

		const result = await highlightCode({ code: '', language: 'typescript' });

		expect(result).toEqual([]);
	});

	it('handles single-line code', async () => {
		mockCodeToTokensBase.mockReturnValue([mockTokenLine1]);

		const result = await highlightCode({ code: 'const x', language: 'javascript' });

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ tokens: mockTokenLine1 });
	});

	it('passes javascript language correctly', async () => {
		await highlightCode({ code: 'var a = 1;', language: 'javascript' });

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('var a = 1;', {
			lang: 'javascript',
			theme: 'night-owl',
		});
	});

	it('passes json language correctly', async () => {
		await highlightCode({ code: '{"key": "value"}', language: 'json' });

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('{"key": "value"}', {
			lang: 'json',
			theme: 'night-owl',
		});
	});

	it('handles multi-line code with three lines', async () => {
		const thirdLine: ThemedToken[] = [
			{ content: 'return x;', color: '#C792EA', offset: 0 },
		];
		mockCodeToTokensBase.mockReturnValue([mockTokenLine1, mockTokenLine2, thirdLine]);

		const result = await highlightCode({ code: 'const x\n  = 1;\nreturn x;', language: 'typescript' });

		expect(result).toHaveLength(3);
		expect(result[2]).toEqual({ tokens: thirdLine });
	});
});
