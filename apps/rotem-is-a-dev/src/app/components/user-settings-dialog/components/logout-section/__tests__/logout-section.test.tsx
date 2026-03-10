import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
}));

import { LogoutSection } from '../logout-section.component';

const mockOnSignOut = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('LogoutSection', () => {
	it('renders sign out button', () => {
		render(<LogoutSection onSignOut={mockOnSignOut} />);
		expect(screen.getByText('Sign out')).toBeInTheDocument();
	});

	it('renders sign out icon', () => {
		render(<LogoutSection onSignOut={mockOnSignOut} />);
		const icon = screen.getByTestId('fa-icon');
		expect(icon).toHaveAttribute('data-icon', 'right-from-bracket');
		expect(icon).toHaveAttribute('data-group', 'fal');
	});

	it('calls onSignOut when button is clicked', () => {
		render(<LogoutSection onSignOut={mockOnSignOut} />);
		fireEvent.click(screen.getByText('Sign out'));
		expect(mockOnSignOut).toHaveBeenCalledTimes(1);
	});
});
