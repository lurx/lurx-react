import { render, screen } from '@testing-library/react';
import { GithubLink } from '../github-link.component';

describe('GithubLink', () => {
	it('renders the github comment text', () => {
		render(<GithubLink />);
		expect(
			screen.getByText('// find my profile on Github:'),
		).toBeInTheDocument();
	});

	it('renders a link to the GitHub profile', () => {
		render(<GithubLink />);
		const link = screen.getByRole('link', { name: 'GitHub profile' });
		expect(link).toHaveAttribute('href', 'https://github.com/lurx');
	});

	it('opens the link in a new tab', () => {
		render(<GithubLink />);
		const link = screen.getByRole('link', { name: 'GitHub profile' });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('displays the github URL as the link text', () => {
		render(<GithubLink />);
		expect(screen.getByText(/"https:\/\/github\.com\/lurx"/)).toBeInTheDocument();
	});
});
