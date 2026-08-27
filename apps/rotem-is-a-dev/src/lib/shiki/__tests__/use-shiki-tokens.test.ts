import { act, renderHook } from '@testing-library/react';
import type { ThemedToken } from 'shiki/core';

const mockCodeToTokens = jest.fn();
const mockGetHighlighter = jest.fn().mockResolvedValue({
	codeToTokens: (...args: unknown[]) => mockCodeToTokens(...args),
});

jest.mock('../get-highlighter', () => ({
	getHighlighter: (...args: unknown[]) => mockGetHighlighter(...args),
}));

import { useShikiTokens } from '../use-shiki-tokens.hook';
import { CODE_THEMES } from '../shiki.constants';

type ShikiLanguage = 'typescript' | 'javascript' | 'json';
type ShikiHookProps = { code: string; language: ShikiLanguage };

const flushPromises = () => act(async () => { await Promise.resolve(); });

const DEFAULT_SHIKI_PROPS: ShikiHookProps = { code: 'const x = 1;', language: 'typescript' };

const renderShikiHook = (props: ShikiHookProps = DEFAULT_SHIKI_PROPS) =>
	renderHook(
		(hookProps: ShikiHookProps) => useShikiTokens(hookProps),
		{ initialProps: props },
	);

const toExpectedToken = (token: ThemedToken) => ({
	content: token.content,
	style: token.htmlStyle,
});

describe('useShikiTokens', () => {
	const mockTokenLine1: ThemedToken[] = [
		{ content: 'const', offset: 0, htmlStyle: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' } },
		{ content: ' x', offset: 0, htmlStyle: { '--shiki-dark': '#D6DEEB', '--shiki-light': '#24292E' } },
	];
	const mockTokenLine2: ThemedToken[] = [
		{ content: '  = 1;', offset: 0, htmlStyle: { '--shiki-dark': '#D6DEEB', '--shiki-light': '#24292E' } },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockCodeToTokens.mockReturnValue({ tokens: [mockTokenLine1, mockTokenLine2] });
	});

	it('returns null initially while loading', () => {
		const { result } = renderShikiHook();
		expect(result.current).toBeNull();
	});

	it('returns highlighted lines after loading completes', async () => {
		const { result } = renderShikiHook();
		await flushPromises();

		expect(result.current).toEqual([
			{ tokens: mockTokenLine1.map(toExpectedToken) },
			{ tokens: mockTokenLine2.map(toExpectedToken) },
		]);
	});

	it('calls getHighlighter to obtain a highlighter instance', async () => {
		renderShikiHook();
		await flushPromises();

		expect(mockGetHighlighter).toHaveBeenCalledTimes(1);
	});

	it('asks for both themes so the colours stay switchable in CSS', async () => {
		renderShikiHook();
		await flushPromises();

		expect(mockCodeToTokens).toHaveBeenCalledWith('const x = 1;', {
			lang: 'typescript',
			themes: CODE_THEMES,
			defaultColor: false,
		});
	});

	it('re-fetches tokens when the code changes', async () => {
		const { result, rerender } = renderShikiHook();
		await flushPromises();

		const updatedTokenLine: ThemedToken[] = [
			{ content: 'let y', offset: 0, htmlStyle: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' } },
		];
		mockCodeToTokens.mockReturnValue({ tokens: [updatedTokenLine] });

		rerender({ code: 'let y = 2;', language: 'typescript' });
		await flushPromises();

		expect(result.current).toEqual([
			{ tokens: updatedTokenLine.map(toExpectedToken) },
		]);
		expect(mockCodeToTokens).toHaveBeenCalledTimes(2);
	});

	it('re-fetches tokens when the language changes', async () => {
		const { rerender } = renderShikiHook();
		await flushPromises();

		rerender({ code: 'const x = 1;', language: 'javascript' });
		await flushPromises();

		expect(mockCodeToTokens).toHaveBeenLastCalledWith('const x = 1;', {
			lang: 'javascript',
			themes: CODE_THEMES,
			defaultColor: false,
		});
	});

	it('does not set state after unmount (cancelled flag)', async () => {
		let resolveHighlighter!: (value: unknown) => void;
		mockGetHighlighter.mockReturnValueOnce(
			new Promise(resolve => {
				resolveHighlighter = resolve;
			}),
		);

		const { unmount } = renderShikiHook();
		unmount();

		await act(async () => {
			resolveHighlighter({
				codeToTokensBase: mockCodeToTokens,
			});
			await Promise.resolve();
		});

		expect(mockCodeToTokens).not.toHaveBeenCalled();
	});

	it('handles empty code', async () => {
		mockCodeToTokens.mockReturnValue({ tokens: [] });

		const { result } = renderShikiHook({ code: '', language: 'typescript' });
		await flushPromises();

		expect(result.current).toEqual([]);
	});

	it('works with json language', async () => {
		renderShikiHook({ code: '{}', language: 'json' });
		await flushPromises();

		expect(mockCodeToTokens).toHaveBeenCalledWith('{}', {
			lang: 'json',
			themes: CODE_THEMES,
			defaultColor: false,
		});
	});
});
