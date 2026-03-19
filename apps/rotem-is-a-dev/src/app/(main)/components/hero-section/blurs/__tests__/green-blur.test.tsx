import { render } from '@testing-library/react';
import { GreenBlur } from '../green-blur.component';

describe('GreenBlur', () => {
	it('renders an SVG element', () => {
		const { container } = render(<GreenBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('is hidden from assistive technology', () => {
		const { container } = render(<GreenBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('aria-hidden', 'true');
	});

	it('has correct default dimensions', () => {
		const { container } = render(<GreenBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '864');
		expect(svg).toHaveAttribute('height', '742');
	});

	it('has the correct viewBox', () => {
		const { container } = render(<GreenBlur />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('viewBox', '0 0 864 742');
	});

	it('accepts custom width and height props', () => {
		const { container } = render(<GreenBlur width={454} height={492} />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '454');
		expect(svg).toHaveAttribute('height', '492');
	});

	it('accepts a className prop', () => {
		const { container } = render(<GreenBlur className="my-class" />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveClass('my-class');
	});

	it('renders a path with the green fill color', () => {
		const { container } = render(<GreenBlur />);
		const path = container.querySelector('path');
		expect(path).toHaveAttribute('fill', '#00D5BE');
	});

	it('renders a filter definition for the blur effect', () => {
		const { container } = render(<GreenBlur />);
		const filter = container.querySelector('filter');
		expect(filter).toBeInTheDocument();
	});

	it('contains a Gaussian blur filter element', () => {
		const { container } = render(<GreenBlur />);
		const gaussianBlur = container.querySelector('feGaussianBlur');
		expect(gaussianBlur).toBeInTheDocument();
		expect(gaussianBlur).toHaveAttribute('stdDeviation', '87');
	});
});
