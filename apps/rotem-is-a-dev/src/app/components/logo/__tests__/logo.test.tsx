import { render } from '@testing-library/react';
import { Logo } from '../logo.component';
import { DEFAULT_LOGO_SIZE, LOGO_SIZES } from '../logo.constants';

jest.mock('../logo.svg', () => ({
	ReactComponent: (props: Record<string, unknown>) => (
		<svg data-testid="logo-svg" {...props} />
	),
}));

describe('Logo', () => {
	it('renders the SVG', () => {
		const { getByTestId } = render(<Logo />);
		expect(getByTestId('logo-svg')).toBeInTheDocument();
	});

	it('applies logo-svg class by default', () => {
		const { getByTestId } = render(<Logo />);
		expect(getByTestId('logo-svg')).toHaveClass('logo-svg');
	});

	it('applies the default size when no size prop is provided', () => {
		const { getByTestId } = render(<Logo />);
		const svg = getByTestId('logo-svg');
		const defaultSize = LOGO_SIZES[DEFAULT_LOGO_SIZE];
		expect(svg).toHaveAttribute('width', String(defaultSize.width));
		expect(svg).toHaveAttribute('height', String(defaultSize.height));
	});

	it('applies the correct size for each size variant', () => {
		for (const [key, dimensions] of Object.entries(LOGO_SIZES)) {
			const { getByTestId, unmount } = render(
				<Logo size={key as keyof typeof LOGO_SIZES} />,
			);
			const svg = getByTestId('logo-svg');
			expect(svg).toHaveAttribute('width', String(dimensions.width));
			expect(svg).toHaveAttribute('height', String(dimensions.height));
			unmount();
		}
	});

	it('does not apply animated class when animated is false', () => {
		const { getByTestId } = render(<Logo animated={false} />);
		expect(getByTestId('logo-svg')).not.toHaveClass('animated');
	});

	it('applies animated class when animated is true', () => {
		const { getByTestId } = render(<Logo animated />);
		expect(getByTestId('logo-svg')).toHaveClass('animated');
	});
});
