import { render, screen } from '@testing-library/react';
import { AboutPage } from '../about-page.component';

describe('AboutPage', () => {
	it('renders the about sections sidebar', () => {
		render(<AboutPage />);
		expect(screen.getByLabelText('About sections')).toBeInTheDocument();
	});

	it('renders the professional info sidebar button', () => {
		render(<AboutPage />);
		expect(
			screen.getByRole('button', { name: 'Professional info' }),
		).toBeInTheDocument();
	});

	it('renders the personal info sidebar button', () => {
		render(<AboutPage />);
		expect(
			screen.getByRole('button', { name: 'Personal info' }),
		).toBeInTheDocument();
	});

	it('renders the hobbies sidebar button', () => {
		render(<AboutPage />);
		expect(
			screen.getByRole('button', { name: 'Hobbies' }),
		).toBeInTheDocument();
	});

	it('renders the file tree navigation', () => {
		render(<AboutPage />);
		expect(screen.getByRole('navigation', { name: 'File tree' })).toBeInTheDocument();
	});

	it('renders the education tab as active', () => {
		render(<AboutPage />);
		const tab = screen.getByRole('tab', { selected: true });
		expect(tab).toHaveTextContent('education');
	});

	it('renders the tab close button', () => {
		render(<AboutPage />);
		expect(screen.getByLabelText('Close tab')).toBeInTheDocument();
	});
});
