import { render, screen } from '@testing-library/react';
import { AsciiArtRenderer } from '../ascii-art-renderer.component';

describe('AsciiArtRenderer', () => {
	it('renders the ascii art content inside a pre element', () => {
		const { container } = render(<AsciiArtRenderer asciiArt="(o_o)" />);
		expect(container.querySelector('pre')).toBeInTheDocument();
		expect(container.querySelector('pre')?.textContent).toBe('(o_o)');
	});

	it('renders multiline ascii art', () => {
		const art = ' /\\\n/  \\';
		render(<AsciiArtRenderer asciiArt={art} />);
		const pre = document.querySelector('pre');
		expect(pre?.textContent).toBe(art);
	});

	it('sets aria-label when asciiArtLabel is provided', () => {
		render(<AsciiArtRenderer asciiArt="404" asciiArtLabel="Not Found" />);
		expect(screen.getByLabelText('Not Found')).toBeInTheDocument();
	});

	it('does not set aria-hidden when asciiArtLabel is provided', () => {
		const { container } = render(
			<AsciiArtRenderer asciiArt="404" asciiArtLabel="Not Found" />,
		);
		expect(container.querySelector('pre')).not.toHaveAttribute('aria-hidden', 'true');
	});

	it('sets aria-hidden to true when no asciiArtLabel is provided', () => {
		const { container } = render(<AsciiArtRenderer asciiArt="(o_o)" />);
		expect(container.querySelector('pre')).toHaveAttribute('aria-hidden', 'true');
	});

	it('does not set aria-label when asciiArtLabel is omitted', () => {
		const { container } = render(<AsciiArtRenderer asciiArt="(o_o)" />);
		expect(container.querySelector('pre')).not.toHaveAttribute('aria-label');
	});
});
