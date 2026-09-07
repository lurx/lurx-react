import type { ThemedToken } from 'shiki/core';

const mockCodeToTokens = jest.fn();

jest.mock('../get-highlighter', () => ({
	getHighlighter: jest.fn().mockResolvedValue({
		codeToTokens: (...args: unknown[]) => mockCodeToTokens(...args),
	}),
}));

import { highlightCode } from '../highlight-code';
import { getHighlighter } from '../get-highlighter';
import { CODE_THEMES } from '../shiki.constants';

function themedToken(content: string, dark: string, light: string): ThemedToken {
	return { content, offset: 0, htmlStyle: { '--shiki-dark': dark, '--shiki-light': light } };
}

function expectedToken(content: string, dark: string, light: string) {
	return { content, style: { '--shiki-dark': dark, '--shiki-light': light } };
}

describe('highlightCode', () => {
	const mockTokenLine1: ThemedToken[] = [
		themedToken('const', '#C792EA', '#D73A49'),
		themedToken(' x', '#D6DEEB', '#24292E'),
	];
	const mockTokenLine2: ThemedToken[] = [
		themedToken('  = 1;', '#D6DEEB', '#24292E'),
	];

	const expectedLine1 = [
		expectedToken('const', '#C792EA', '#D73A49'),
		expectedToken(' x', '#D6DEEB', '#24292E'),
	];
	const expectedLine2 = [expectedToken('  = 1;', '#D6DEEB', '#24292E')];

	beforeEach(() => {
		jest.clearAllMocks();
		mockCodeToTokens.mockReturnValue({ tokens: [mockTokenLine1, mockTokenLine2] });
	});

	it('calls getHighlighter to obtain a highlighter instance', async () => {
		await highlightCode({ code: 'const x = 1;', language: 'typescript' });

		expect(getHighlighter).toHaveBeenCalledTimes(1);
	});

	it('asks for both themes so the colours stay switchable in CSS', async () => {
		await highlightCode({ code: 'const x = 1;', language: 'typescript' });

		expect(mockCodeToTokens).toHaveBeenCalledWith('const x = 1;', {
			lang: 'typescript',
			themes: CODE_THEMES,
			defaultColor: false,
		});
	});

	it('transforms token lines into ShikiLine objects carrying both colours', async () => {
		const result = await highlightCode({ code: 'const x = 1;', language: 'typescript' });

		expect(result).toEqual([
			{ tokens: expectedLine1 },
			{ tokens: expectedLine2 },
		]);
	});

	it('returns an empty array when code produces no token lines', async () => {
		mockCodeToTokens.mockReturnValue({ tokens: [] });

		const result = await highlightCode({ code: '', language: 'typescript' });

		expect(result).toEqual([]);
	});

	it('handles single-line code', async () => {
		mockCodeToTokens.mockReturnValue({ tokens: [mockTokenLine1] });

		const result = await highlightCode({ code: 'const x', language: 'javascript' });

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ tokens: expectedLine1 });
	});

	it('passes javascript language correctly', async () => {
		await highlightCode({ code: 'var a = 1;', language: 'javascript' });

		expect(mockCodeToTokens).toHaveBeenCalledWith('var a = 1;', {
			lang: 'javascript',
			themes: CODE_THEMES,
			defaultColor: false,
		});
	});

	it('passes json language correctly', async () => {
		await highlightCode({ code: '{"key": "value"}', language: 'json' });

		expect(mockCodeToTokens).toHaveBeenCalledWith('{"key": "value"}', {
			lang: 'json',
			themes: CODE_THEMES,
			defaultColor: false,
		});
	});

	it('handles multi-line code with three lines', async () => {
		const thirdLine: ThemedToken[] = [themedToken('return x;', '#C792EA', '#D73A49')];
		mockCodeToTokens.mockReturnValue({
			tokens: [mockTokenLine1, mockTokenLine2, thirdLine],
		});

		const result = await highlightCode({
			code: 'const x\n  = 1;\nreturn x;',
			language: 'typescript',
		});

		expect(result).toHaveLength(3);
		expect(result[2]).toEqual({
			tokens: [expectedToken('return x;', '#C792EA', '#D73A49')],
		});
	});
});
