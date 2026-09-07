import { render } from '@testing-library/react';
import type { ShikiLine } from '@/lib/shiki';
import { ShikiCode } from '../shiki-code.component';

describe('ShikiCode', () => {
	const mockLines: ShikiLine[] = [
		{
			tokens: [
				{ content: 'const', style: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' } },
				{ content: ' x', style: { '--shiki-dark': '#D6DEEB', '--shiki-light': '#24292E' } },
			],
		},
		{
			tokens: [
				{ content: '  = 1;', style: { '--shiki-dark': '#D6DEEB', '--shiki-light': '#24292E' } },
			],
		},
	];

	it('renders each line as a span element', () => {
		const { container } = render(<ShikiCode lines={mockLines} />);

		const lineSpans = container.querySelectorAll(':scope > span');
		expect(lineSpans).toHaveLength(2);
	});

	it('renders tokens with correct content', () => {
		const { container } = render(<ShikiCode lines={mockLines} />);

		const allSpans = container.querySelectorAll('span span');
		expect(allSpans[0]).toHaveTextContent('const');
		expect(allSpans[1].textContent).toBe(' x');
		expect(allSpans[2].textContent).toBe('  = 1;');
	});

	it('applies token colors as inline styles', () => {
		const { container } = render(<ShikiCode lines={mockLines} />);

		const allSpans = container.querySelectorAll('span span');
		expect(allSpans[0]).toHaveStyle({ '--shiki-dark': '#C792EA' });
		expect(allSpans[1]).toHaveStyle({ '--shiki-dark': '#D6DEEB' });
		expect(allSpans[2]).toHaveStyle({ '--shiki-dark': '#D6DEEB' });
	});

	it('appends a newline character after each line', () => {
		const { container } = render(<ShikiCode lines={mockLines} />);

		const lineSpans = container.querySelectorAll(':scope > span');
		expect(lineSpans[0].textContent).toContain('\n');
		expect(lineSpans[1].textContent).toContain('\n');
	});

	it('renders an empty fragment for an empty lines array', () => {
		const { container } = render(<ShikiCode lines={[]} />);

		expect(container.innerHTML).toBe('');
	});

	it('renders a single line with multiple tokens', () => {
		const singleLine: ShikiLine[] = [
			{
				tokens: [
					{ content: 'let', style: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' } },
					{ content: ' y', style: { '--shiki-dark': '#D6DEEB', '--shiki-light': '#24292E' } },
					{ content: ' = ', style: { '--shiki-dark': '#C792EA', '--shiki-light': '#D73A49' } },
					{ content: '"hello"', style: { '--shiki-dark': '#ECC48D', '--shiki-light': '#032F62' } },
				],
			},
		];

		const { container } = render(<ShikiCode lines={singleLine} />);

		const tokenSpans = container.querySelectorAll('span span');
		expect(tokenSpans).toHaveLength(4);
		expect(tokenSpans[0]).toHaveTextContent('let');
		expect(tokenSpans[3]).toHaveTextContent('"hello"');
		expect(tokenSpans[3]).toHaveStyle({ '--shiki-dark': '#ECC48D' });
	});

	it('renders a line with a single token', () => {
		const singleTokenLine: ShikiLine[] = [
			{
				tokens: [{ content: '// comment', style: { '--shiki-dark': '#637777', '--shiki-light': '#6A737D' } }],
			},
		];

		const { container } = render(<ShikiCode lines={singleTokenLine} />);

		const tokenSpans = container.querySelectorAll('span span');
		expect(tokenSpans).toHaveLength(1);
		expect(tokenSpans[0]).toHaveTextContent('// comment');
		expect(tokenSpans[0]).toHaveStyle({ '--shiki-dark': '#637777' });
	});

	it('preserves whitespace in token content', () => {
		const whitespaceLines: ShikiLine[] = [
			{
				tokens: [
					{ content: '  indented', style: { '--shiki-dark': '#D6DEEB', '--shiki-light': '#24292E' } },
				],
			},
		];

		const { container } = render(<ShikiCode lines={whitespaceLines} />);

		const tokenSpan = container.querySelector('span span');
		expect(tokenSpan?.textContent).toBe('  indented');
	});
});
