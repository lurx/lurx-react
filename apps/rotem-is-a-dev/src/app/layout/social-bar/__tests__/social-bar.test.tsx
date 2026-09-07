import { render, screen } from '@testing-library/react';
import { SocialBar } from '../social-bar.component';
import { ThemeProvider } from '../../theme';

// The theme switcher lives in here, so it needs the provider its page supplies.
const renderWithTheme = () =>
	render(
		<ThemeProvider>
			<SocialBar />
		</ThemeProvider>,
	);

describe('SocialBar', () => {
	it('renders the "find me in:" label', () => {
		renderWithTheme();
		expect(screen.getByText('find me in:')).toBeInTheDocument();
	});

	it('renders the Twitter/X link', () => {
		renderWithTheme();
		const twitterLink = screen.getByRole('link', { name: 'X (Twitter)' });
		expect(twitterLink).toBeInTheDocument();
		expect(twitterLink).toHaveAttribute('href', 'https://x.com/lurx');
		expect(twitterLink).toHaveAttribute('target', '_blank');
	});

	it('renders the LinkedIn link', () => {
		renderWithTheme();
		const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
		expect(linkedinLink).toBeInTheDocument();
		expect(linkedinLink).toHaveAttribute(
			'href',
			'https://linkedin.com/in/rotem-horovitz',
		);
	});

	it('renders the GitHub link', () => {
		renderWithTheme();
		const githubLink = screen.getByRole('link', { name: 'GitHub' });
		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute('href', 'https://github.com/lurx');
		expect(githubLink).toHaveAttribute('target', '_blank');
	});

	it('has a footer landmark', () => {
		renderWithTheme();
		expect(screen.getByRole('contentinfo')).toBeInTheDocument();
	});

	it('opens all external links in a new tab', () => {
		renderWithTheme();
		const externalLinks = screen.getAllByRole('link').filter(
			(link) => link.getAttribute('href')?.startsWith('http'),
		);
		externalLinks.forEach((link) => {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	it('renders a privacy policy link', () => {
		renderWithTheme();
		const privacyLink = screen.getByRole('link', { name: 'privacy' });
		expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
	});
});
