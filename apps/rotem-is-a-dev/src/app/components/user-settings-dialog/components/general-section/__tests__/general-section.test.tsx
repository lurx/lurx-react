import { render, screen } from '@testing-library/react';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
	UserAvatar: ({ size }: { size: number }) => (
		<span data-testid="user-avatar" data-size={size} />
	),
}));

import { GeneralSection } from '../general-section.component';

const mockUser = {
	uid: '123',
	displayName: 'Test User',
	email: 'test@example.com',
	photoURL: 'https://photo.url/avatar.jpg',
	provider: 'google' as const,
};

describe('GeneralSection', () => {
	it('renders user avatar with size 64', () => {
		render(<GeneralSection user={mockUser} />);
		const avatar = screen.getByTestId('user-avatar');
		expect(avatar).toHaveAttribute('data-size', '64');
	});

	it('renders display name', () => {
		render(<GeneralSection user={mockUser} />);
		expect(screen.getByText('Test User')).toBeInTheDocument();
	});

	it('renders email', () => {
		render(<GeneralSection user={mockUser} />);
		expect(screen.getByText('test@example.com')).toBeInTheDocument();
	});

	it('renders provider badge for Google', () => {
		render(<GeneralSection user={mockUser} />);
		expect(screen.getByText('Signed in with Google')).toBeInTheDocument();
	});

	it('renders provider badge for GitHub', () => {
		render(<GeneralSection user={{ ...mockUser, provider: 'github' }} />);
		expect(screen.getByText('Signed in with GitHub')).toBeInTheDocument();
	});

	it('renders provider icon', () => {
		render(<GeneralSection user={mockUser} />);
		const icons = screen.getAllByTestId('fa-icon');
		const providerIcon = icons.find(
			icon => icon.getAttribute('data-icon') === 'google' && icon.getAttribute('data-group') === 'fab',
		);
		expect(providerIcon).toBeInTheDocument();
	});
});
