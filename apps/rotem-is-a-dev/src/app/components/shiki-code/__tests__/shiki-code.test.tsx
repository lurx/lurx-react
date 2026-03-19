import { render } from '@testing-library/react';
import type { ShikiLine } from '@/lib/shiki';
import { ShikiCode } from '../shiki-code.component';

describe('ShikiCode', () => {
	const mockLines: ShikiLine[] = [
		{
			tokens: [
				{ content: 'const', color: '#C792EA', offset: 0 },
				{ content: ' x', color: '#D6DEEB', offset: 6 },
			],
		},
		{
			tokens: [
				{ content: '  = 1;', color: '#D6DEEB', offset: 0 },
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
		expect(allSpans[0]).toHaveStyle({ color: '#C792EA' });
		expect(allSpans[1]).toHaveStyle({ color: '#D6DEEB' });
		expect(allSpans[2]).toHaveStyle({ color: '#D6DEEB' });
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
					{ content: 'let', color: '#C792EA', offset: 0 },
					{ content: ' y', color: '#D6DEEB', offset: 4 },
					{ content: ' = ', color: '#C792EA', offset: 6 },
					{ content: '"hello"', color: '#ECC48D', offset: 9 },
				],
			},
		];

		const { container } = render(<ShikiCode lines={singleLine} />);

		const tokenSpans = container.querySelectorAll('span span');
		expect(tokenSpans).toHaveLength(4);
		expect(tokenSpans[0]).toHaveTextContent('let');
		expect(tokenSpans[3]).toHaveTextContent('"hello"');
		expect(tokenSpans[3]).toHaveStyle({ color: '#ECC48D' });
	});

	it('renders a line with a single token', () => {
		const singleTokenLine: ShikiLine[] = [
			{
				tokens: [{ content: '// comment', color: '#637777', offset: 0 }],
			},
		];

		const { container } = render(<ShikiCode lines={singleTokenLine} />);

		const tokenSpans = container.querySelectorAll('span span');
		expect(tokenSpans).toHaveLength(1);
		expect(tokenSpans[0]).toHaveTextContent('// comment');
		expect(tokenSpans[0]).toHaveStyle({ color: '#637777' });
	});

	it('preserves whitespace in token content', () => {
		const whitespaceLines: ShikiLine[] = [
			{
				tokens: [
					{ content: '  indented', color: '#D6DEEB', offset: 0 },
				],
			},
		];

		const { container } = render(<ShikiCode lines={whitespaceLines} />);

		const tokenSpan = container.querySelector('span span');
		expect(tokenSpan?.textContent).toBe('  indented');
	});
});
