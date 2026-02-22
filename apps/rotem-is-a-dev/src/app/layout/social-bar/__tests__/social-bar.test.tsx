import { render, screen } from '@testing-library/react';
import { SocialBar } from '../social-bar.component';

describe('SocialBar', () => {
	it('renders the "find me in:" label', () => {
		render(<SocialBar />);
		expect(screen.getByText('find me in:')).toBeInTheDocument();
	});

	it('renders the Twitter/X link', () => {
		render(<SocialBar />);
		const twitterLink = screen.getByRole('link', { name: 'X (Twitter)' });
		expect(twitterLink).toBeInTheDocument();
		expect(twitterLink).toHaveAttribute('href', 'https://x.com/lurxie');
		expect(twitterLink).toHaveAttribute('target', '_blank');
	});

	it('renders the LinkedIn link', () => {
		render(<SocialBar />);
		const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
		expect(linkedinLink).toBeInTheDocument();
		expect(linkedinLink).toHaveAttribute(
			'href',
			'https://linkedin.com/in/rotem-lurx-horovitz-9601705',
		);
	});

	it('renders the GitHub link', () => {
		render(<SocialBar />);
		const githubLink = screen.getByRole('link', { name: 'GitHub' });
		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute('href', 'https://github.com/lurx');
		expect(githubLink).toHaveAttribute('target', '_blank');
	});

	it('has a footer landmark', () => {
		render(<SocialBar />);
		expect(screen.getByRole('contentinfo')).toBeInTheDocument();
	});

	it('opens all external links in a new tab', () => {
		render(<SocialBar />);
		const links = screen.getAllByRole('link');
		links.forEach((link) => {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});
});
