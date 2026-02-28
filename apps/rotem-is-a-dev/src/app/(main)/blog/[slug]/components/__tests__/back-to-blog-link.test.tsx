import { render, screen } from '@testing-library/react';
import { BackToBlogLink } from '../back-to-blog-link.component';

describe('BackToBlogLink', () => {
	it('renders a link back to the blog', () => {
		render(<BackToBlogLink />);
		expect(screen.getByRole('link')).toBeInTheDocument();
	});

	it('links to /blog', () => {
		render(<BackToBlogLink />);
		expect(screen.getByRole('link')).toHaveAttribute('href', '/blog');
	});

	it('renders the back arrow and label text', () => {
		render(<BackToBlogLink />);
		expect(screen.getByRole('link')).toHaveTextContent('← Back to blog');
	});

	it('renders the progress bar with aria-hidden', () => {
		const { container } = render(<BackToBlogLink />);
		const progressBar = container.querySelector('[aria-hidden="true"]');
		expect(progressBar).toBeInTheDocument();
	});

	it('applies the backLink class to the wrapper', () => {
		const { container } = render(<BackToBlogLink />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className).toContain('backLink');
	});

	it('applies the backLinkText class to the link', () => {
		render(<BackToBlogLink />);
		const link = screen.getByRole('link');
		expect(link.className).toContain('backLinkText');
	});
});
