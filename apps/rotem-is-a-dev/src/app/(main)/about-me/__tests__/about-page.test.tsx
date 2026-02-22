import { fireEvent, render, screen } from '@testing-library/react';
import { AboutPage } from '../about-page.component';

jest.mock('../components/about-editor/use-shiki-tokens.hook', () => ({
	useShikiTokens: ({ code }: { code: string }) =>
		code.split('\n').map((line: string) => ({
			tokens: [{ content: line, color: '#90a1b9' }],
		})),
}));

describe('AboutPage', () => {
	it('renders the about sections sidebar', () => {
		render(<AboutPage />);
		expect(screen.getByLabelText('About sections')).toBeInTheDocument();
	});

	it('renders the professional info sidebar button', () => {
		render(<AboutPage />);
		expect(
			screen.getByRole('button', { name: 'Work experience' }),
		).toBeInTheDocument();
	});

	it('renders the personal info sidebar button', () => {
		render(<AboutPage />);
		expect(
			screen.getByRole('button', { name: 'Personal info' }),
		).toBeInTheDocument();
	});

	it('does not render sidebar buttons for empty sections', () => {
		render(<AboutPage />);
		expect(
			screen.queryByRole('button', { name: 'Hobbies' }),
		).not.toBeInTheDocument();
	});

	it('renders the file tree navigation', () => {
		render(<AboutPage />);
		expect(
			screen.getByRole('navigation', { name: 'File tree' }),
		).toBeInTheDocument();
	});

	it('renders the bio tab as active by default', () => {
		render(<AboutPage />);
		const tab = screen.getByRole('tab', { selected: true });
		expect(tab).toHaveTextContent('bio');
	});

	it('renders the tab close button', () => {
		render(<AboutPage />);
		expect(screen.getByLabelText('Close bio tab')).toBeInTheDocument();
	});

	it('opens a new tab when clicking a file in the tree', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByRole('button', { name: /interests/ }));

		const tabs = screen.getAllByRole('tab');
		expect(tabs).toHaveLength(2);
	});

	it('switches active tab when clicking a file', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByRole('button', { name: /interests/ }));

		const activeTab = screen.getByRole('tab', { selected: true });
		expect(activeTab).toHaveTextContent('interests');
	});

	it('does not duplicate tab when clicking already-open file', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByRole('button', { name: 'interests' }));
		fireEvent.click(screen.getByRole('button', { name: 'bio' }));

		const tabs = screen.getAllByRole('tab');
		expect(tabs).toHaveLength(2);
	});

	it('closes a tab when clicking its close button', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByRole('button', { name: /interests/ }));
		fireEvent.click(screen.getByLabelText('Close interests tab'));

		const tabs = screen.getAllByRole('tab');
		expect(tabs).toHaveLength(1);
	});

	it('shows empty state when closing the last tab', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByLabelText('Close bio tab'));

		expect(screen.queryAllByRole('tab')).toHaveLength(0);
		expect(screen.getByText('choose a file')).toBeInTheDocument();
	});

	it('opens a file from the empty state', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByLabelText('Close bio tab'));
		fireEvent.click(screen.getByRole('button', { name: /bio/ }));

		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('bio');
		expect(screen.queryByText('choose a file')).not.toBeInTheDocument();
	});

	it('switches active tab when clicking a tab directly', () => {
		render(<AboutPage />);

		// Open a second tab
		fireEvent.click(screen.getByRole('button', { name: /interests/ }));

		// Click back on the bio tab
		const bioTab = screen.getByRole('tab', { name: /bio/ });
		fireEvent.click(bioTab);

		const activeTab = screen.getByRole('tab', { selected: true });
		expect(activeTab).toHaveTextContent('bio');
	});

	it('falls back to last remaining tab when closing the active tab', () => {
		render(<AboutPage />);

		// Open second tab and make it active
		fireEvent.click(screen.getByRole('button', { name: /interests/ }));
		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('interests');

		// Close the active tab (interests) — should fall back to bio
		fireEvent.click(screen.getByLabelText('Close interests tab'));
		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('bio');
	});

	it('closes an inactive tab without changing the active tab', () => {
		render(<AboutPage />);

		// Open second tab (interests is now active)
		fireEvent.click(screen.getByRole('button', { name: /interests/ }));
		// Switch back to bio
		fireEvent.click(screen.getByRole('tab', { name: /bio/ }));
		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('bio');

		// Close the inactive interests tab
		fireEvent.click(screen.getByLabelText('Close interests tab'));
		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('bio');
		expect(screen.getAllByRole('tab')).toHaveLength(1);
	});

	it('shows all section folders in the file tree', () => {
		render(<AboutPage />);

		expect(screen.getByText('personal-info')).toBeInTheDocument();
		expect(screen.getByText('work-experience')).toBeInTheDocument();
		expect(screen.getByText('payoneer')).toBeInTheDocument();
		expect(screen.getByText('startup-booster')).toBeInTheDocument();
	});

	it('opens a work-experience file as a tab with JSON content', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByRole('button', { name: /payoneer/ }));

		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('payoneer');
		expect(screen.getByLabelText('payoneer content')).toBeInTheDocument();
	});

	it('highlights the matching sidebar button based on active file', () => {
		render(<AboutPage />);

		// bio is in personal-info section
		const personalInfoButton = screen.getByRole('button', { name: 'Personal info' });
		expect(personalInfoButton).toHaveAttribute('aria-pressed', 'true');

		// Open a work-experience file
		fireEvent.click(screen.getByRole('button', { name: /payoneer/ }));

		const workExpButton = screen.getByRole('button', { name: 'Work experience' });
		expect(workExpButton).toHaveAttribute('aria-pressed', 'true');
		expect(personalInfoButton).toHaveAttribute('aria-pressed', 'false');
	});

	it('opens the default personal-info file when clicking the sidebar button', () => {
		render(<AboutPage />);

		// Close bio, then click Personal info sidebar button
		fireEvent.click(screen.getByLabelText('Close bio tab'));
		fireEvent.click(screen.getByRole('button', { name: 'Personal info' }));

		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('bio');
	});

	it('opens the default work-experience file when clicking the sidebar button', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByRole('button', { name: 'Work experience' }));

		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('payoneer');
	});

	it('clears sidebar highlight when no file is active', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByLabelText('Close bio tab'));

		const personalInfoButton = screen.getByRole('button', { name: 'Personal info' });
		const workExpButton = screen.getByRole('button', { name: 'Work experience' });
		expect(personalInfoButton).toHaveAttribute('aria-pressed', 'false');
		expect(workExpButton).toHaveAttribute('aria-pressed', 'false');
	});
});
