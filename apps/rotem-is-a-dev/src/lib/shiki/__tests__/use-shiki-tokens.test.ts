import { act, renderHook } from '@testing-library/react';
import type { ThemedToken } from 'shiki/core';

const mockCodeToTokensBase = jest.fn();
const mockGetHighlighter = jest.fn().mockResolvedValue({
	codeToTokensBase: (...args: unknown[]) => mockCodeToTokensBase(...args),
});

jest.mock('../get-highlighter', () => ({
	getHighlighter: (...args: unknown[]) => mockGetHighlighter(...args),
}));

import { useShikiTokens } from '../use-shiki-tokens.hook';

type ShikiLanguage = 'typescript' | 'javascript' | 'json';
type ShikiHookProps = { code: string; language: ShikiLanguage };

const flushPromises = () => act(async () => { await Promise.resolve(); });

const DEFAULT_SHIKI_PROPS: ShikiHookProps = { code: 'const x = 1;', language: 'typescript' };

const renderShikiHook = (props: ShikiHookProps = DEFAULT_SHIKI_PROPS) =>
	renderHook(
		(hookProps: ShikiHookProps) => useShikiTokens(hookProps),
		{ initialProps: props },
	);

describe('useShikiTokens', () => {
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

	it('returns null initially while loading', () => {
		const { result } = renderShikiHook();
		expect(result.current).toBeNull();
	});

	it('returns highlighted lines after loading completes', async () => {
		const { result } = renderShikiHook();
		await flushPromises();

		expect(result.current).toEqual([
			{ tokens: mockTokenLine1 },
			{ tokens: mockTokenLine2 },
		]);
	});

	it('calls getHighlighter to obtain a highlighter instance', async () => {
		renderShikiHook();
		await flushPromises();

		expect(mockGetHighlighter).toHaveBeenCalledTimes(1);
	});

	it('calls codeToTokensBase with code, language, and night-owl theme', async () => {
		renderShikiHook();
		await flushPromises();

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('const x = 1;', {
			lang: 'typescript',
			theme: 'night-owl',
		});
	});

	it('re-fetches tokens when the code changes', async () => {
		const { result, rerender } = renderShikiHook();
		await flushPromises();

		const updatedTokenLine: ThemedToken[] = [
			{ content: 'let y', color: '#C792EA', offset: 0 },
		];
		mockCodeToTokensBase.mockReturnValue([updatedTokenLine]);

		rerender({ code: 'let y = 2;', language: 'typescript' });
		await flushPromises();

		expect(result.current).toEqual([{ tokens: updatedTokenLine }]);
		expect(mockCodeToTokensBase).toHaveBeenCalledTimes(2);
	});

	it('re-fetches tokens when the language changes', async () => {
		const { rerender } = renderShikiHook();
		await flushPromises();

		rerender({ code: 'const x = 1;', language: 'javascript' });
		await flushPromises();

		expect(mockCodeToTokensBase).toHaveBeenLastCalledWith('const x = 1;', {
			lang: 'javascript',
			theme: 'night-owl',
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
				codeToTokensBase: mockCodeToTokensBase,
			});
			await Promise.resolve();
		});

		expect(mockCodeToTokensBase).not.toHaveBeenCalled();
	});

	it('handles empty code', async () => {
		mockCodeToTokensBase.mockReturnValue([]);

		const { result } = renderShikiHook({ code: '', language: 'typescript' });
		await flushPromises();

		expect(result.current).toEqual([]);
	});

	it('works with json language', async () => {
		renderShikiHook({ code: '{}', language: 'json' });
		await flushPromises();

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('{}', {
			lang: 'json',
			theme: 'night-owl',
		});
	});
});
