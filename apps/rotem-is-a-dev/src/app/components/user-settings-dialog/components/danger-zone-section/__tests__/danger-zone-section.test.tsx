import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DangerZoneSection } from '../danger-zone-section.component';

const mockOnDeleteAccount = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
	mockOnDeleteAccount.mockResolvedValue(undefined);
});

describe('DangerZoneSection', () => {
	it('renders delete account button', () => {
		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		expect(screen.getByText('Delete my account')).toBeInTheDocument();
	});

	it('shows confirmation when delete button is clicked', () => {
		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		fireEvent.click(screen.getByText('Delete my account'));
		expect(screen.getByText(/This action is permanent/)).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Yes, delete my account')).toBeInTheDocument();
	});

	it('hides confirmation when cancel is clicked', () => {
		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		fireEvent.click(screen.getByText('Delete my account'));
		fireEvent.click(screen.getByText('Cancel'));
		expect(screen.queryByText(/This action is permanent/)).not.toBeInTheDocument();
		expect(screen.getByText('Delete my account')).toBeInTheDocument();
	});

	it('calls onDeleteAccount when confirm is clicked', async () => {
		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		fireEvent.click(screen.getByText('Delete my account'));
		fireEvent.click(screen.getByText('Yes, delete my account'));
		await waitFor(() => {
			expect(mockOnDeleteAccount).toHaveBeenCalledTimes(1);
		});
	});

	it('shows reauth error when auth/requires-recent-login is thrown', async () => {
		mockOnDeleteAccount.mockRejectedValue({ code: 'auth/requires-recent-login' });
		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		fireEvent.click(screen.getByText('Delete my account'));
		fireEvent.click(screen.getByText('Yes, delete my account'));
		await waitFor(() => {
			expect(screen.getByText(/please sign out and sign back in/)).toBeInTheDocument();
		});
	});

	it('shows generic error message for non-auth errors', async () => {
		const genericError = new Error('Network error');
		mockOnDeleteAccount.mockRejectedValue(genericError);

		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		fireEvent.click(screen.getByText('Delete my account'));
		fireEvent.click(screen.getByText('Yes, delete my account'));

		await waitFor(() => {
			expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
		});

		expect(screen.queryByText(/please sign out and sign back in/)).not.toBeInTheDocument();
	});

	it('disables buttons while deleting', async () => {
		let resolveDelete: () => void = () => undefined;
		mockOnDeleteAccount.mockImplementation(
			() => new Promise<void>(resolve => { resolveDelete = resolve; }),
		);

		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);
		fireEvent.click(screen.getByText('Delete my account'));
		fireEvent.click(screen.getByText('Yes, delete my account'));

		await waitFor(() => {
			expect(screen.getByText('Deleting...')).toBeInTheDocument();
		});
		expect(screen.getByText('Cancel')).toBeDisabled();
		expect(screen.getByText('Deleting...')).toBeDisabled();

		resolveDelete();
	});

	it('clears error when starting new confirmation', async () => {
		mockOnDeleteAccount.mockRejectedValue({ code: 'auth/requires-recent-login' });
		render(<DangerZoneSection onDeleteAccount={mockOnDeleteAccount} />);

		fireEvent.click(screen.getByText('Delete my account'));
		fireEvent.click(screen.getByText('Yes, delete my account'));
		await waitFor(() => {
			expect(screen.getByText(/please sign out and sign back in/)).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('Cancel'));
		fireEvent.click(screen.getByText('Delete my account'));
		expect(screen.queryByText(/please sign out and sign back in/)).not.toBeInTheDocument();
	});
});
