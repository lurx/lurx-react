import { render, screen } from '@testing-library/react';
import { HeroCtaActions } from '../hero-cta-actions.component';

describe('HeroCtaActions', () => {
	it('renders the view-projects and contact CTAs with correct hrefs', () => {
		render(<HeroCtaActions />);

		const viewProjects = screen.getByRole('link', { name: /view-projects/ });
		expect(viewProjects).toHaveAttribute('href', '/projects');

		const contactMe = screen.getByRole('link', { name: /contact-me/ });
		expect(contactMe).toHaveAttribute('href', '/contact');
	});
});
