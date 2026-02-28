import { render } from '@testing-library/react';
import { HeroBlurs } from '../hero-blurs.component';

jest.mock('../../blurs/blue-blur.component', () => ({
	BlueBlur: (props: React.SVGProps<SVGSVGElement>) => (
		<svg data-testid="blue-blur" {...props} />
	),
}));

jest.mock('../../blurs/green-blur.component', () => ({
	GreenBlur: (props: React.SVGProps<SVGSVGElement>) => (
		<svg data-testid="green-blur" {...props} />
	),
}));

describe('HeroBlurs', () => {
	it('renders the GreenBlur component', () => {
		const { getByTestId } = render(<HeroBlurs />);
		expect(getByTestId('green-blur')).toBeInTheDocument();
	});

	it('renders the BlueBlur component', () => {
		const { getByTestId } = render(<HeroBlurs />);
		expect(getByTestId('blue-blur')).toBeInTheDocument();
	});

	it('passes width 454 to GreenBlur', () => {
		const { getByTestId } = render(<HeroBlurs />);
		expect(getByTestId('green-blur')).toHaveAttribute('width', '454');
	});

	it('passes height 492 to GreenBlur', () => {
		const { getByTestId } = render(<HeroBlurs />);
		expect(getByTestId('green-blur')).toHaveAttribute('height', '492');
	});

	it('passes width 454 to BlueBlur', () => {
		const { getByTestId } = render(<HeroBlurs />);
		expect(getByTestId('blue-blur')).toHaveAttribute('width', '454');
	});

	it('passes height 492 to BlueBlur', () => {
		const { getByTestId } = render(<HeroBlurs />);
		expect(getByTestId('blue-blur')).toHaveAttribute('height', '492');
	});

	it('wraps both blurs in a container div', () => {
		const { container } = render(<HeroBlurs />);
		const wrapper = container.firstChild;
		expect(wrapper?.nodeName).toBe('DIV');
		expect(wrapper?.childNodes).toHaveLength(2);
	});
});
