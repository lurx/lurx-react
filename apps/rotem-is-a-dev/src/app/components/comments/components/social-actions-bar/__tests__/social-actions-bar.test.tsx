import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid={`fa-icon-${iconName}`} data-icon-group={iconGroup} />
	),
}));

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

import { SocialActionsBar } from '../social-actions-bar.component';
import type { SocialActionsBarProps } from '../social-actions-bar.types';

const defaultProps: SocialActionsBarProps = {
	starCount: 0,
	hasUserStarred: false,
	commentCount: 0,
	hasUserCommented: false,
	isAuthenticated: true,
	onStarClick: jest.fn(),
	onCommentClick: jest.fn(),
};

const renderBar = (overrides: Partial<SocialActionsBarProps> = {}) =>
	render(<SocialActionsBar {...defaultProps} {...overrides} />);

beforeEach(() => {
	jest.clearAllMocks();
});

describe('SocialActionsBar', () => {
	it('renders the social actions bar', () => {
		renderBar();
		expect(screen.getByTestId('social-actions-bar')).toBeInTheDocument();
	});

	it('renders star and comment buttons', () => {
		renderBar();
		expect(screen.getByTestId('star-button')).toBeInTheDocument();
		expect(screen.getByTestId('comment-button')).toBeInTheDocument();
	});

	it('displays star count', () => {
		renderBar({ starCount: 5 });
		expect(screen.getByTestId('star-count')).toHaveTextContent('5');
	});

	it('displays comment count', () => {
		renderBar({ commentCount: 3 });
		expect(screen.getByTestId('comment-count')).toHaveTextContent('3');
	});

	it('uses light icon when not starred', () => {
		renderBar({ hasUserStarred: false });
		expect(screen.getByTestId('fa-icon-star')).toHaveAttribute('data-icon-group', 'fal');
	});

	it('uses solid icon when starred', () => {
		renderBar({ hasUserStarred: true });
		expect(screen.getByTestId('fa-icon-star')).toHaveAttribute('data-icon-group', 'fas');
	});

	it('uses light icon when user has not commented', () => {
		renderBar({ hasUserCommented: false });
		expect(screen.getByTestId('fa-icon-comment')).toHaveAttribute('data-icon-group', 'fal');
	});

	it('uses solid icon when user has commented', () => {
		renderBar({ hasUserCommented: true });
		expect(screen.getByTestId('fa-icon-comment')).toHaveAttribute('data-icon-group', 'fas');
	});

	it('calls onStarClick when authenticated user clicks star', () => {
		const onStarClick = jest.fn();
		renderBar({ isAuthenticated: true, onStarClick });
		fireEvent.click(screen.getByTestId('star-button'));
		expect(onStarClick).toHaveBeenCalledTimes(1);
	});

	it('opens sign-in dialog when unauthenticated user clicks star', () => {
		const onStarClick = jest.fn();
		renderBar({ isAuthenticated: false, onStarClick });
		fireEvent.click(screen.getByTestId('star-button'));
		expect(onStarClick).not.toHaveBeenCalled();
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();
	});

	it('closes sign-in dialog when close is triggered', () => {
		renderBar({ isAuthenticated: false });
		fireEvent.click(screen.getByTestId('star-button'));
		expect(screen.getByTestId('sign-in-dialog')).toBeInTheDocument();

		fireEvent.click(screen.getByTestId('close-dialog'));
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});

	it('calls onCommentClick when comment button is clicked', () => {
		const onCommentClick = jest.fn();
		renderBar({ onCommentClick });
		fireEvent.click(screen.getByTestId('comment-button'));
		expect(onCommentClick).toHaveBeenCalledTimes(1);
	});

	it('has correct aria-label for star button when not starred', () => {
		renderBar({ hasUserStarred: false });
		expect(screen.getByTestId('star-button')).toHaveAttribute('aria-label', 'Star');
	});

	it('has correct aria-label for star button when starred', () => {
		renderBar({ hasUserStarred: true });
		expect(screen.getByTestId('star-button')).toHaveAttribute('aria-label', 'Unstar');
	});

	it('has correct aria-label for comment button', () => {
		renderBar();
		expect(screen.getByTestId('comment-button')).toHaveAttribute('aria-label', 'Jump to comments');
	});

	it('does not show sign-in dialog initially', () => {
		renderBar({ isAuthenticated: false });
		expect(screen.queryByTestId('sign-in-dialog')).not.toBeInTheDocument();
	});
});
