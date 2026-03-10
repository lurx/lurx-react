import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockUser = {
	uid: '123',
	displayName: 'Test User',
	email: 'test@example.com',
	photoURL: 'https://photo.url/avatar.jpg',
	provider: 'google' as const,
};

const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockDeleteUser = jest.fn().mockResolvedValue(undefined);

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({
		user: mockUser,
		signOut: mockSignOut,
		deleteUser: mockDeleteUser,
	}),
}));

jest.mock('../components', () => ({
	GeneralSection: ({ user }: { user: { displayName: string } }) => (
		<div data-testid="general-section">{user.displayName}</div>
	),
	AccessibilitySection: () => <div data-testid="accessibility-section" />,
	DangerZoneSection: ({ onDeleteAccount }: { onDeleteAccount: () => void }) => (
		<button data-testid="danger-zone-section" onClick={onDeleteAccount} />
	),
	LogoutSection: ({ onSignOut }: { onSignOut: () => void }) => (
		<button data-testid="logout-section" onClick={onSignOut} />
	),
}));

jest.mock('../../dialog', () => ({
	Dialog: ({
		isOpen,
		children,
		ariaLabel,
	}: {
		isOpen: boolean;
		children: React.ReactNode;
		ariaLabel: string;
	}) => (isOpen ? <div data-testid="dialog" aria-label={ariaLabel}>{children}</div> : null),
}));

import { UserSettingsDialog } from '../user-settings-dialog.component';

const mockOnClose = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('UserSettingsDialog', () => {
	it('renders nothing when not open', () => {
		const { container } = render(
			<UserSettingsDialog isOpen={false} onClose={mockOnClose} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders dialog with title when open', () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});

	it('renders all four sections', () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('general-section')).toBeInTheDocument();
		expect(screen.getByTestId('accessibility-section')).toBeInTheDocument();
		expect(screen.getByTestId('danger-zone-section')).toBeInTheDocument();
		expect(screen.getByTestId('logout-section')).toBeInTheDocument();
	});

	it('passes user to GeneralSection', () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('general-section')).toHaveTextContent('Test User');
	});

	it('calls signOut and onClose when logout section triggers', async () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.click(screen.getByTestId('logout-section'));
		await waitFor(() => {
			expect(mockSignOut).toHaveBeenCalledTimes(1);
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});

	it('calls deleteUser and onClose when danger zone section triggers', async () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		fireEvent.click(screen.getByTestId('danger-zone-section'));
		await waitFor(() => {
			expect(mockDeleteUser).toHaveBeenCalledTimes(1);
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});

	it('renders section titles', () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByText('Profile')).toBeInTheDocument();
		expect(screen.getByText('Accessibility')).toBeInTheDocument();
		expect(screen.getByText('Danger zone')).toBeInTheDocument();
		expect(screen.getByText('Session')).toBeInTheDocument();
	});

	it('sets correct aria-label on dialog', () => {
		render(<UserSettingsDialog isOpen={true} onClose={mockOnClose} />);
		expect(screen.getByTestId('dialog')).toHaveAttribute('aria-label', 'User settings');
	});
});
