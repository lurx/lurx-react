import { render, screen } from '@testing-library/react';
import { NoPosts } from '../no-posts.component';

jest.mock('@/app/components', () => ({
	AsciiArtRenderer: ({ asciiArtLabel }: { asciiArt: string; asciiArtLabel: string }) => (
		<pre aria-label={asciiArtLabel}>ascii art</pre>
	),
}));

jest.mock('@/ascii-art', () => ({
	ASCII_NO_POSTS: 'NO POSTS ASCII ART',
}));

describe('NoPosts', () => {
	it('renders the empty state message', () => {
		render(<NoPosts />);
		expect(screen.getByText('No posts match the current filters.')).toBeInTheDocument();
	});

	it('renders the ascii art with a label', () => {
		render(<NoPosts />);
		expect(screen.getByLabelText('No posts found')).toBeInTheDocument();
	});

	it('applies the empty class to the wrapper', () => {
		const { container } = render(<NoPosts />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className).toContain('empty');
	});
});
