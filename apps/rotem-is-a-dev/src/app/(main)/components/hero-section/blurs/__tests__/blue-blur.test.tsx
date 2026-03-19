import { render } from '@testing-library/react';
import { BlueBlur } from '../blue-blur.component';

describe('BlueBlur', () => {
	it('renders an SVG element', () => {
		const { container } = render(<BlueBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('is hidden from assistive technology', () => {
		const { container } = render(<BlueBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('aria-hidden', 'true');
	});

	it('has correct default dimensions', () => {
		const { container } = render(<BlueBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '881');
		expect(svg).toHaveAttribute('height', '783');
	});

	it('has the correct viewBox', () => {
		const { container } = render(<BlueBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('viewBox', '0 0 881 783');
	});

	it('accepts custom width and height props', () => {
		const { container } = render(<BlueBlur width={454} height={492} />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '454');
		expect(svg).toHaveAttribute('height', '492');
	});

	it('accepts a className prop', () => {
		const { container } = render(<BlueBlur className="my-class" />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveClass('my-class');
	});

	it('renders a path with the blue fill color', () => {
		const { container } = render(<BlueBlur />);
		const path = container.querySelector('path');
		expect(path).toHaveAttribute('fill', '#615FFF');
	});

	it('renders a filter definition for the blur effect', () => {
		const { container } = render(<BlueBlur />);
		const filter = container.querySelector('filter');
		expect(filter).toBeInTheDocument();
	});

	it('contains a Gaussian blur filter element', () => {
		const { container } = render(<BlueBlur />);
		const gaussianBlur = container.querySelector('feGaussianBlur');
		expect(gaussianBlur).toBeInTheDocument();
		expect(gaussianBlur).toHaveAttribute('stdDeviation', '87');
	});
});
