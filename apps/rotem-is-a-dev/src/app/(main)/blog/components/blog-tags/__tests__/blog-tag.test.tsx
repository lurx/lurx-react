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

	it('sets data-draft attribute when draft is true', () => {
		const { container } = render(<BlogTag tag="draft" draft />);
		const span = container.firstChild as HTMLElement;
		expect(span).toHaveAttribute('data-draft');
	});

	it('does not set data-draft attribute when draft is false', () => {
		const { container } = render(<BlogTag tag="react" />);
		const span = container.firstChild as HTMLElement;
		expect(span).not.toHaveAttribute('data-draft');
	});
});
