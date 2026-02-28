import { render, screen } from '@testing-library/react';
import { BlogTag } from '../blog-tag.component';

describe('BlogTag', () => {
	it('renders the tag text', () => {
		render(<BlogTag tag="react" />);
		expect(screen.getByText('react')).toBeInTheDocument();
	});

	it('renders as a span element', () => {
		const { container } = render(<BlogTag tag="typescript" />);
		expect(container.firstChild?.nodeName).toBe('SPAN');
	});

	it('renders with a different tag value', () => {
		render(<BlogTag tag="next.js" />);
		expect(screen.getByText('next.js')).toBeInTheDocument();
	});

	it('applies the tag class', () => {
		const { container } = render(<BlogTag tag="css" />);
		const span = container.firstChild as HTMLElement;
		expect(span.className).toContain('tag');
	});
});
