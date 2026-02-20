import { render, screen } from '@testing-library/react';
import { HeroIntroduction } from '../hero-introduction.component';

describe('HeroIntroduction', () => {
	it('renders the greeting', () => {
		render(<HeroIntroduction />);
		expect(screen.getByText('Hi all. I am')).toBeInTheDocument();
	});

	it('renders the name', () => {
		render(<HeroIntroduction />);
		expect(screen.getByText('Rotem Horovitz')).toBeInTheDocument();
	});

	it('renders the role line', () => {
		render(<HeroIntroduction />);
		expect(screen.getByText(/front-end developer/)).toBeInTheDocument();
	});

	it('renders the GitHub profile link', () => {
		render(<HeroIntroduction />);
		expect(
			screen.getByRole('link', { name: 'GitHub profile' }),
		).toBeInTheDocument();
	});
});
