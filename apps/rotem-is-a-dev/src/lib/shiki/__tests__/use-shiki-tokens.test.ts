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
		const { result } = renderHook(() =>
			useShikiTokens({ code: 'const x = 1;', language: 'typescript' }),
		);

		expect(result.current).toBeNull();
	});

	it('returns highlighted lines after loading completes', async () => {
		const { result } = renderHook(() =>
			useShikiTokens({ code: 'const x = 1;', language: 'typescript' }),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current).toEqual([
			{ tokens: mockTokenLine1 },
			{ tokens: mockTokenLine2 },
		]);
	});

	it('calls getHighlighter to obtain a highlighter instance', async () => {
		renderHook(() =>
			useShikiTokens({ code: 'const x = 1;', language: 'typescript' }),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(mockGetHighlighter).toHaveBeenCalledTimes(1);
	});

	it('calls codeToTokensBase with code, language, and night-owl theme', async () => {
		renderHook(() =>
			useShikiTokens({ code: 'const x = 1;', language: 'typescript' }),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('const x = 1;', {
			lang: 'typescript',
			theme: 'night-owl',
		});
	});

	it('re-fetches tokens when the code changes', async () => {
		const { result, rerender } = renderHook(
			({ code, language }: { code: string; language: ShikiLanguage }) =>
				useShikiTokens({ code, language }),
			{ initialProps: { code: 'const x = 1;', language: 'typescript' as const } },
		);

		await act(async () => {
			await Promise.resolve();
		});

		const updatedTokenLine: ThemedToken[] = [
			{ content: 'let y', color: '#C792EA', offset: 0 },
		];
		mockCodeToTokensBase.mockReturnValue([updatedTokenLine]);

		rerender({ code: 'let y = 2;', language: 'typescript' });

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current).toEqual([{ tokens: updatedTokenLine }]);
		expect(mockCodeToTokensBase).toHaveBeenCalledTimes(2);
	});

	it('re-fetches tokens when the language changes', async () => {
		const { rerender } = renderHook(
			({ code, language }: { code: string; language: ShikiLanguage }) =>
				useShikiTokens({ code, language }),
			{ initialProps: { code: 'const x = 1;', language: 'typescript' as ShikiLanguage } },
		);

		await act(async () => {
			await Promise.resolve();
		});

		rerender({ code: 'const x = 1;', language: 'javascript' });

		await act(async () => {
			await Promise.resolve();
		});

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

		const { unmount } = renderHook(() =>
			useShikiTokens({ code: 'const x = 1;', language: 'typescript' }),
		);

		unmount();

		await act(async () => {
			resolveHighlighter({
				codeToTokensBase: mockCodeToTokensBase,
			});
			await Promise.resolve();
		});

		// No error thrown from setting state on unmounted component
		expect(mockCodeToTokensBase).not.toHaveBeenCalled();
	});

	it('handles empty code', async () => {
		mockCodeToTokensBase.mockReturnValue([]);

		const { result } = renderHook(() =>
			useShikiTokens({ code: '', language: 'typescript' }),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current).toEqual([]);
	});

	it('works with json language', async () => {
		renderHook(() =>
			useShikiTokens({ code: '{}', language: 'json' }),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(mockCodeToTokensBase).toHaveBeenCalledWith('{}', {
			lang: 'json',
			theme: 'night-owl',
		});
	});
});
