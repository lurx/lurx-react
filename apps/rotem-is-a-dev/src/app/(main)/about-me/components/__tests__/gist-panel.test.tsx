import { render, screen } from '@testing-library/react';
import { GistPanel } from '../gist-panel.component';

describe('GistPanel', () => {
	it('renders the panel title', () => {
		render(<GistPanel />);
		expect(screen.getByText('// Code snippet showcase:')).toBeInTheDocument();
	});

	it('renders two gist snippet cards', () => {
		render(<GistPanel />);
		const usernames = screen.getAllByText('@lurx');
		expect(usernames).toHaveLength(2);
	});

	it('renders created-at timestamps for each snippet', () => {
		render(<GistPanel />);
		expect(screen.getByText('Created 5 months ago')).toBeInTheDocument();
		expect(screen.getByText('Created 9 months ago')).toBeInTheDocument();
	});

	it('renders details and stars actions for each snippet', () => {
		render(<GistPanel />);
		const detailsLabels = screen.getAllByText(/details/);
		const starsLabels = screen.getAllByText(/stars/);
		expect(detailsLabels).toHaveLength(2);
		expect(starsLabels).toHaveLength(2);
	});

	it('renders two code blocks', () => {
		render(<GistPanel />);
		const codeBlocks = screen.getAllByRole('generic').filter((el) =>
			el.className.includes('codeBlock'),
		);
		expect(codeBlocks).toHaveLength(2);
	});
});
