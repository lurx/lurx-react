import { render, screen } from '@testing-library/react';

const mockUser = {
	uid: '123',
	displayName: 'Test User',
	email: 'test@example.com',
	photoURL: 'https://photo.url/avatar.jpg',
	provider: 'google' as const,
};

jest.mock('@/app/context/auth', () => ({
	useAuth: () => ({ user: mockUser }),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
	UserAvatar: ({ size }: { size: number }) => (
		<span data-testid="user-avatar" data-size={size} />
	),
}));

import { GeneralSection } from '../general-section.component';

describe('GeneralSection', () => {
	it('renders user avatar with size 64', () => {
		render(<GeneralSection />);
		const avatar = screen.getByTestId('user-avatar');
		expect(avatar).toHaveAttribute('data-size', '64');
	});

	it('renders display name', () => {
		render(<GeneralSection />);
		expect(screen.getByText('Test User')).toBeInTheDocument();
	});

	it('renders email', () => {
		render(<GeneralSection />);
		expect(screen.getByText('test@example.com')).toBeInTheDocument();
	});

	it('renders provider badge for Google', () => {
		render(<GeneralSection />);
		expect(screen.getByText('Signed in with Google')).toBeInTheDocument();
	});

	it('renders provider badge for GitHub', () => {
		jest.resetModules();
		jest.doMock('@/app/context/auth', () => ({
			useAuth: () => ({ user: { ...mockUser, provider: 'github' } }),
		}));
		jest.doMock('@/app/components', () => ({
			FaIcon: ({ iconName, iconGroup }: { iconName: string; iconGroup: string }) => (
				<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
			),
			UserAvatar: ({ size }: { size: number }) => (
				<span data-testid="user-avatar" data-size={size} />
			),
		}));
		const { GeneralSection: Fresh } = require('../general-section.component');
		render(<Fresh />);
		expect(screen.getByText('Signed in with GitHub')).toBeInTheDocument();
	});

	it('renders provider icon', () => {
		render(<GeneralSection />);
		const icons = screen.getAllByTestId('fa-icon');
		const providerIcon = icons.find(
			icon => icon.dataset.icon === 'google' && icon.dataset.group === 'fab',
		);
		expect(providerIcon).toBeInTheDocument();
	});

	it('renders nothing when no user', () => {
		jest.resetModules();
		jest.doMock('@/app/context/auth', () => ({
			useAuth: () => ({ user: null }),
		}));
		jest.doMock('@/app/components', () => ({
			FaIcon: () => <span />,
			UserAvatar: () => <span />,
		}));
		const { GeneralSection: Fresh } = require('../general-section.component');
		const { container } = render(<Fresh />);
		expect(container).toBeEmptyDOMElement();
	});
});
