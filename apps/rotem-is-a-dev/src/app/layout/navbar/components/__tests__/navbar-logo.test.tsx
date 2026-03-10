import { render, screen } from '@testing-library/react';

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

	it('renders with data-animate-text="logo" attribute', () => {
		const { container } = render(<NavbarLogo title="rotem-horovitz" />);
		const animateEl = container.querySelector('[data-animate-text="logo"]');
		expect(animateEl).toBeInTheDocument();
	});
});
