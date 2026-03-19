import { render, screen } from '@testing-library/react';

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName, iconGroup, size }: { iconName: string; iconGroup: string; size?: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} data-size={size} />
	),
}));

jest.mock('next/image', () => ({
	__esModule: true,
	default: ({ src, alt, width, height, className }: Record<string, unknown>) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img src={src as string} alt={alt as string} width={width as number} height={height as number} className={className as string} />
	),
}));

import { UserAvatar } from '../user-avatar.component';

describe('UserAvatar', () => {
	it('renders fallback icon when photoURL is null', () => {
		render(<UserAvatar photoURL={null} displayName="Test" provider="google" />);
		const icon = screen.getByTestId('fa-icon');
		expect(icon).toHaveAttribute('data-icon', 'circle-user');
		expect(icon).toHaveAttribute('data-group', 'fal');
	});

	it('renders avatar image when photoURL is provided', () => {
		render(<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="google" />);
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
		expect(img).toHaveAttribute('alt', 'Jane');
	});

	it('uses empty string as alt when displayName is null', () => {
		const { container } = render(
			<UserAvatar photoURL="https://example.com/avatar.jpg" displayName={null} provider="google" />,
		);
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('alt', '');
	});

	it('renders with default size', () => {
		render(<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="google" />);
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('width', '28');
		expect(img).toHaveAttribute('height', '28');
	});

	it('renders with custom size', () => {
		render(<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="google" size={40} />);
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('width', '40');
		expect(img).toHaveAttribute('height', '40');
	});

	it('renders google provider badge', () => {
		render(<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="google" />);
		const icons = screen.getAllByTestId('fa-icon');
		const providerIcon = icons.find(icon => icon.dataset.icon === 'google');
		expect(providerIcon).toHaveAttribute('data-group', 'fab');
		expect(providerIcon).toHaveAttribute('data-size', 'xs');
	});

	it('renders github provider badge', () => {
		render(<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="github" />);
		const icons = screen.getAllByTestId('fa-icon');
		const providerIcon = icons.find(icon => icon.dataset.icon === 'github');
		expect(providerIcon).toBeInTheDocument();
	});

	it('applies provider class to container and image', () => {
		const { container } = render(
			<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="google" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className).toContain('avatarContainer');
		expect(wrapper.className).toContain('google');
		const img = container.querySelector('img');
		expect(img?.className).toContain('avatar');
		expect(img?.className).toContain('google');
	});

	it('applies github class when provider is github', () => {
		const { container } = render(
			<UserAvatar photoURL="https://example.com/avatar.jpg" displayName="Jane" provider="github" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className).toContain('github');
	});
});
