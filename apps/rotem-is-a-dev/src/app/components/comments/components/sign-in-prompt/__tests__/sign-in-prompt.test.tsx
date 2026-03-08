import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/components/sign-in-dialog', () => ({
	SignInDialog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
		isOpen ? (
			<div data-testid="sign-in-dialog">
				<button type="button" onClick={onClose} data-testid="close-dialog">
					close
				</button>
			</div>
		) : null,
}));

import { SignInPrompt } from '../sign-in-prompt.component';

beforeEach(() => {
	jest.clearAllMocks();
});

describe('SignInPrompt', () => {
	it('renders the sign-in prompt', () => {
		render(<SignInPrompt />);
		expect(screen.getByTestId('sign-in-prompt')).toBeInTheDocument();
	});

	it('displays the message text', () => {
		render(<SignInPrompt />);
		expect(screen.getByText('Sign in to leave a comment')).toBeInTheDocument();
	});

	it('renders a sign-in button', () => {
		render(<SignInPrompt />);
		expect(screen.getByTestId('sign-in-prompt-button')).toHaveTextContent('Sign in');
	});

	it('does not show the sign-in dialog initially', () => {
		render(<SignInPrompt />);
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});

	it('opens the sign-in dialog when button is clicked', () => {
		render(<SignInPrompt />);
		fireEvent.click(screen.getByTestId('sign-in-prompt-button'));
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();
	});

	it('closes the sign-in dialog when dialog close is triggered', () => {
		render(<SignInPrompt />);
		fireEvent.click(screen.getByTestId('sign-in-prompt-button'));
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();

		fireEvent.click(screen.getByTestId('close-dialog'));
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});
});
