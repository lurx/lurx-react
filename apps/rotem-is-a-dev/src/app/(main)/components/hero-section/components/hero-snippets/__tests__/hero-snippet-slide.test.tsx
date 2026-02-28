import { render, screen } from '@testing-library/react';
import { SnippetSlide } from '../hero-snippet-slide.component';

jest.mock('@/app/components', () => ({
	CodeBlock: ({ code, className }: { code: string; className?: string }) => (
		<pre data-testid="code-block" className={className}>
			{code}
		</pre>
	),
}));

describe('SnippetSlide', () => {
	const defaultProps = {
		title: 'debounce',
		code: 'function debounce() {}',
		opacity: 1,
	};

	it('renders the title', () => {
		render(<SnippetSlide {...defaultProps} />);
		expect(screen.getByText('debounce')).toBeInTheDocument();
	});

	it('renders the CodeBlock with the provided code', () => {
		render(<SnippetSlide {...defaultProps} />);
		expect(screen.getByTestId('code-block')).toHaveTextContent(
			'function debounce() {}',
		);
	});

	it('applies the opacity style to the slide container', () => {
		const { container } = render(<SnippetSlide {...defaultProps} opacity={0.4} />);
		const slide = container.firstChild as HTMLElement;
		expect(slide).toHaveStyle({ opacity: '0.4' });
	});

	it('applies opacity 1 for the active slide', () => {
		const { container } = render(<SnippetSlide {...defaultProps} opacity={1} />);
		const slide = container.firstChild as HTMLElement;
		expect(slide).toHaveStyle({ opacity: '1' });
	});

	it('applies opacity 0.1 for far slides', () => {
		const { container } = render(<SnippetSlide {...defaultProps} opacity={0.1} />);
		const slide = container.firstChild as HTMLElement;
		expect(slide).toHaveStyle({ opacity: '0.1' });
	});

	it('renders different titles correctly', () => {
		render(<SnippetSlide {...defaultProps} title="throttle" />);
		expect(screen.getByText('throttle')).toBeInTheDocument();
	});

	it('has displayName set to SnippetSlide', () => {
		expect(SnippetSlide.displayName).toBe('SnippetSlide');
	});
});
