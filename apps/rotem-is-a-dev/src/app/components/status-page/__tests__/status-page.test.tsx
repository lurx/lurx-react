import { render, screen } from '@testing-library/react';
import { StatusPage } from '../status-page.component';

describe('StatusPage', () => {
	it('renders the ASCII art', () => {
		render(<StatusPage asciiArt="ASCII_ART">Content</StatusPage>);
		expect(screen.getByText('ASCII_ART')).toBeInTheDocument();
	});

	it('hides ASCII art from assistive technology by default', () => {
		const { container } = render(
			<StatusPage asciiArt="ASCII_ART">Content</StatusPage>,
		);
		const pre = container.querySelector('pre');
		expect(pre).toHaveAttribute('aria-hidden', 'true');
	});

	it('uses aria-label when asciiArtLabel is provided', () => {
		const { container } = render(
			<StatusPage asciiArt="ASCII_ART" asciiArtLabel="404">
				Content
			</StatusPage>,
		);
		const pre = container.querySelector('pre');
		expect(pre).toHaveAttribute('aria-label', '404');
		expect(pre).not.toHaveAttribute('aria-hidden', 'true');
	});

	it('renders children content', () => {
		render(
			<StatusPage asciiArt="ASCII_ART">
				<p>Custom content here</p>
			</StatusPage>,
		);
		expect(screen.getByText('Custom content here')).toBeInTheDocument();
	});

	it('renders ASCII art and children side by side', () => {
		const { container } = render(
			<StatusPage asciiArt="ASCII_ART">
				<span>Right side</span>
			</StatusPage>,
		);
		const pre = container.querySelector('pre');
		const contentDiv = screen.getByText('Right side').closest('div');
		expect(pre?.parentElement).toBe(contentDiv?.parentElement);
	});
});
