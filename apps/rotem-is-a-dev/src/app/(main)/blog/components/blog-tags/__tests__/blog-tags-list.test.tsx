import { render, screen } from '@testing-library/react';
import { BlogTagsList } from '../blog-tags-list.component';

describe('BlogTagsList', () => {
	it('renders all provided tags', () => {
		render(<BlogTagsList tags={['react', 'typescript', 'next.js']} />);
		expect(screen.getByText('react')).toBeInTheDocument();
		expect(screen.getByText('typescript')).toBeInTheDocument();
		expect(screen.getByText('next.js')).toBeInTheDocument();
	});

	it('renders nothing when tags array is empty', () => {
		const { container } = render(<BlogTagsList tags={[]} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.children).toHaveLength(0);
	});

	it('renders the correct number of tags', () => {
		const { container } = render(<BlogTagsList tags={['a', 'b', 'c']} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.children).toHaveLength(3);
	});

	it('renders each tag as a span', () => {
		const { container } = render(<BlogTagsList tags={['css']} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.firstChild?.nodeName).toBe('SPAN');
	});

	it('applies the tags class to the wrapper', () => {
		const { container } = render(<BlogTagsList tags={['scss']} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className).toContain('tags');
	});

	it('renders a single tag correctly', () => {
		render(<BlogTagsList tags={['gsap']} />);
		expect(screen.getByText('gsap')).toBeInTheDocument();
	});
});
