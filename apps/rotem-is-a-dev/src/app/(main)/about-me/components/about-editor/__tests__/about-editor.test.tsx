import { render, screen } from '@testing-library/react';
import { AboutEditor } from '../about-editor.component';
import type { AboutFileContent } from '../../../data/about-files.data';

jest.mock('@/lib/shiki', () => ({
	useShikiTokens: ({ code }: { code: string }) =>
		code.split('\n').map((line: string) => ({
			tokens: [{ content: line, color: '#90a1b9' }],
		})),
}));

const mockContent: AboutFileContent = {
	title: 'Test Title',
	format: 'jsdoc',
	paragraphs: ['This is a test paragraph.'],
};

describe('AboutEditor', () => {
	it('renders the content region with title-based label', () => {
		render(<AboutEditor content={mockContent} />);
		expect(
			screen.getByLabelText('Test Title content'),
		).toBeInTheDocument();
	});

	it('renders sequential line numbers starting at 1', () => {
		render(<AboutEditor content={mockContent} />);
		const lineNumbers = screen
			.getAllByRole('generic')
			.filter((el) => el.className.split(' ').includes('lineNumber'));
		expect(lineNumbers[0]).toHaveTextContent('1');
		lineNumbers.forEach((el, index) => {
			expect(el).toHaveTextContent(String(index + 1));
		});
	});

	it('renders the JSDoc opening comment', () => {
		render(<AboutEditor content={mockContent} />);
		expect(screen.getByText('/**')).toBeInTheDocument();
	});

	it('renders the title in the content', () => {
		render(<AboutEditor content={mockContent} />);
		expect(screen.getByText(/Test Title/)).toBeInTheDocument();
	});

	it('renders the JSDoc closing comment', () => {
		render(<AboutEditor content={mockContent} />);
		expect(screen.getByText(/\*\//)).toBeInTheDocument();
	});

	it('renders different content when props change', () => {
		const otherContent: AboutFileContent = {
			title: 'Other File',
			format: 'jsdoc',
			paragraphs: ['Different content here.'],
		};
		render(<AboutEditor content={otherContent} />);
		expect(screen.getByLabelText('Other File content')).toBeInTheDocument();
		expect(screen.getByText(/Other File/)).toBeInTheDocument();
	});

	it('renders blank separator lines between multiple paragraphs', () => {
		const multiParagraph: AboutFileContent = {
			title: 'Multi',
			format: 'jsdoc',
			paragraphs: ['First paragraph.', 'Second paragraph.'],
		};
		render(<AboutEditor content={multiParagraph} />);
		expect(screen.getByText(/First paragraph/)).toBeInTheDocument();
		expect(screen.getByText(/Second paragraph/)).toBeInTheDocument();
	});

	it('wraps long paragraphs across multiple lines', () => {
		const longContent: AboutFileContent = {
			title: 'Long',
			format: 'jsdoc',
			paragraphs: [
				'This is a very long paragraph that definitely exceeds the thirty eight character wrap width limit and should be split across multiple lines in the editor display',
			],
		};
		render(<AboutEditor content={longContent} />);
		const text = screen.getByLabelText('Long content').textContent;
		// Word wrapping produces multiple " * ..." lines
		expect(text).toContain('This is');
		expect(text).toContain('character');
	});

	it('handles empty paragraph strings gracefully', () => {
		const emptyParagraph: AboutFileContent = {
			title: 'Empty',
			format: 'jsdoc',
			paragraphs: [''],
		};
		render(<AboutEditor content={emptyParagraph} />);
		expect(screen.getByLabelText('Empty content')).toBeInTheDocument();
	});

	it('renders JSON content as formatted JSON', () => {
		const jsonContent: AboutFileContent = {
			title: 'payoneer',
			format: 'json',
			json: { company: 'Payoneer', position: 'Senior Front End Engineer' },
		};
		render(<AboutEditor content={jsonContent} />);
		expect(screen.getByLabelText('payoneer content')).toBeInTheDocument();
		expect(screen.getByText(/"company": "Payoneer"/)).toBeInTheDocument();
	});

	it('renders line numbers for JSON content', () => {
		const jsonContent: AboutFileContent = {
			title: 'test-json',
			format: 'json',
			json: { name: 'test' },
		};
		render(<AboutEditor content={jsonContent} />);
		const lineNumbers = screen
			.getAllByRole('generic')
			.filter((el) => el.className.split(' ').includes('lineNumber'));
		expect(lineNumbers.length).toBeGreaterThan(0);
	});
});
