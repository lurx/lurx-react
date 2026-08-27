import type { ThemedToken } from 'shiki/core';
import { toShikiLines } from '../shiki.helpers';

describe('toShikiLines', () => {
	it('carries both themes’ custom properties onto the token style', () => {
		const tokens: ThemedToken[][] = [
			[
				{
					content: 'const',
					offset: 0,
					htmlStyle: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' },
				},
			],
		];

		expect(toShikiLines(tokens)).toEqual([
			{
				tokens: [
					{
						content: 'const',
						style: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' },
					},
				],
			},
		]);
	});

	it('falls back to an empty style when htmlStyle is missing', () => {
		const tokens: ThemedToken[][] = [[{ content: 'x', offset: 0 }]];

		expect(toShikiLines(tokens)).toEqual([
			{ tokens: [{ content: 'x', style: {} }] },
		]);
	});

	it('returns an empty array for no lines', () => {
		expect(toShikiLines([])).toEqual([]);
	});
});
