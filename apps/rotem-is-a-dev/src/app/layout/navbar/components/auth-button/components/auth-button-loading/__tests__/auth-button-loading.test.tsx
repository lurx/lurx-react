import { render, screen } from '@testing-library/react';

jest.mock('@/app/components', () => ({
	AnimatedLoader: ({ size }: { size: string }) => (
		<span data-testid="animated-loader" data-size={size} />
	),
}));

jest.mock('@/app/components/logo/logo.constants', () => ({
	LOGO_SIZES: { ICON: 'icon' },
}));

import { AuthButtonLoading } from '../auth-button-loading.component';

describe('AuthButtonLoading', () => {
	it('renders a disabled button', () => {
		render(<AuthButtonLoading />);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('renders AnimatedLoader with ICON size', () => {
		render(<AuthButtonLoading />);
		const loader = screen.getByTestId('animated-loader');
		expect(loader).toBeInTheDocument();
		expect(loader).toHaveAttribute('data-size', 'icon');
	});

	it('renders button with type="button"', () => {
		render(<AuthButtonLoading />);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});
});
