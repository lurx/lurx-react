import { render, screen } from '@testing-library/react';

jest.mock('@awesome.me/kit-1d40de302b/icons', () => ({
	byPrefixAndName: {
		fal: {
			'rectangle-beta': { iconName: 'rectangle-beta', prefix: 'fal', icon: [] },
		},
	},
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
	FontAwesomeIcon: ({ icon }: { icon: { iconName: string } }) => (
		<span data-testid="fa-icon">{icon?.iconName}</span>
	),
}));

jest.mock('next/link', () => ({
	__esModule: true,
	default: ({ href, children }: { href: string; children: React.ReactNode }) => (
		<a href={href}>{children}</a>
	),
}));

jest.mock('@/app/components', () => ({
	Logo: () => <span data-testid="logo-svg" />,
	LOGO_SIZES: { ICON: 'icon' },
}));

import { NavbarLogo } from '../navbar-logo.component';

describe('NavbarLogo', () => {
	it('renders the title text', () => {
		render(<NavbarLogo title="rotem-horovitz" />);
		expect(screen.getByText('rotem-horovitz')).toBeInTheDocument();
	});

	it('renders a link to the home page', () => {
		render(<NavbarLogo title="rotem-horovitz" />);
		expect(screen.getByRole('link')).toHaveAttribute('href', '/');
	});

	it('renders the Logo component', () => {
		render(<NavbarLogo title="rotem-horovitz" />);
		expect(screen.getByTestId('logo-svg')).toBeInTheDocument();
	});

	it('renders the beta icon', () => {
		render(<NavbarLogo title="rotem-horovitz" />);
		expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
	});

	it('renders the beta icon as aria-hidden', () => {
		render(<NavbarLogo title="rotem-horovitz" />);
		const betaIconContainer = screen.getByTestId('fa-icon').closest('[aria-hidden]');
		expect(betaIconContainer).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders with data-animate-text="logo" attribute', () => {
		const { container } = render(<NavbarLogo title="rotem-horovitz" />);
		const animateEl = container.querySelector('[data-animate-text="logo"]');
		expect(animateEl).toBeInTheDocument();
	});

	it('renders with data-animate-icon on the beta icon wrapper', () => {
		const { container } = render(<NavbarLogo title="rotem-horovitz" />);
		const animateIcon = container.querySelector('[data-animate-icon]');
		expect(animateIcon).toBeInTheDocument();
	});
});
