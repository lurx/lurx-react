import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, iconGroup, size }: { iconName: string; iconGroup: string; size?: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} data-size={size} />
	),
}));

import { AuthDropdown } from '../auth-dropdown.component';

const mockOpenSettings = jest.fn();
const mockOnSignOut = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('AuthDropdown', () => {
	it('renders nothing when not open', () => {
		const { container } = render(
			<AuthDropdown isOpen={false} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders menu when open', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('renders Settings menu item', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});

	it('renders Sign out menu item', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		expect(screen.getByText('Sign out')).toBeInTheDocument();
	});

	it('renders two menu items', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		expect(screen.getAllByRole('menuitem')).toHaveLength(2);
	});

	it('calls openSettings when Settings is clicked', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		fireEvent.click(screen.getByText('Settings'));
		expect(mockOpenSettings).toHaveBeenCalledTimes(1);
	});

	it('calls onSignOut when Sign out is clicked', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		fireEvent.click(screen.getByText('Sign out'));
		expect(mockOnSignOut).toHaveBeenCalledTimes(1);
	});

	it('renders gear icon for Settings', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		const icons = screen.getAllByTestId('fa-icon');
		const gearIcon = icons.find(icon => icon.dataset.icon === 'gear');
		expect(gearIcon).toBeInTheDocument();
		expect(gearIcon).toHaveAttribute('data-group', 'fal');
	});

	it('renders bracket icon for Sign out', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		const icons = screen.getAllByTestId('fa-icon');
		const bracketIcon = icons.find(icon => icon.dataset.icon === 'right-from-bracket');
		expect(bracketIcon).toBeInTheDocument();
		expect(bracketIcon).toHaveAttribute('data-group', 'fal');
	});

	it('renders buttons with type="button"', () => {
		render(<AuthDropdown isOpen={true} openSettings={mockOpenSettings} onSignOut={mockOnSignOut} />);
		const buttons = screen.getAllByRole('menuitem');
		buttons.forEach(button => {
			expect(button).toHaveAttribute('type', 'button');
		});
	});
});
