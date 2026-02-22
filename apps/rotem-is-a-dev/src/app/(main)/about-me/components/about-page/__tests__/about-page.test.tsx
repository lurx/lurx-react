import { fireEvent, render, screen } from '@testing-library/react';
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

		fireEvent.click(screen.getByRole('button', { name: /interests/ }));

		const fileTree = screen.getByRole('navigation', { name: 'File tree' });
		const bioButton = fileTree.querySelector('button') as HTMLButtonElement;
		fireEvent.click(bioButton);

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

	it('prevents closing the last remaining tab', () => {
		render(<AboutPage />);

		fireEvent.click(screen.getByLabelText('Close bio tab'));

		const tabs = screen.getAllByRole('tab');
		expect(tabs).toHaveLength(1);
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
});
