import { render, screen } from '@testing-library/react';
import { Link } from '../link.component';

describe('Link', () => {
	it('renders an anchor with the correct href', () => {
		render(<Link href="/about">About</Link>);
		const anchor = screen.getByRole('link', { name: 'About' });
		expect(anchor).toHaveAttribute('href', '/about');
	});

	it('renders children as link text', () => {
		render(<Link href="/test">Click me</Link>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('adds target and rel attributes for http links', () => {
		render(<Link href="https://example.com">External</Link>);
		const anchor = screen.getByRole('link', { name: 'External' });
		expect(anchor).toHaveAttribute('target', '_blank');
		expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('adds target and rel attributes for mailto links', () => {
		render(<Link href="mailto:test@example.com">Email</Link>);
		const anchor = screen.getByRole('link', { name: 'Email' });
		expect(anchor).toHaveAttribute('target', '_blank');
		expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('does not add external attributes for internal links', () => {
		render(<Link href="/internal">Internal</Link>);
		const anchor = screen.getByRole('link', { name: 'Internal' });
		expect(anchor).not.toHaveAttribute('target');
		expect(anchor).not.toHaveAttribute('rel');
	});

	it('does not add external attributes for hash links', () => {
		render(<Link href="#section">Hash</Link>);
		const anchor = screen.getByRole('link', { name: 'Hash' });
		expect(anchor).not.toHaveAttribute('target');
	});
});
