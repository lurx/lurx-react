import { render, screen } from '@testing-library/react';
import { WolverinePeck } from '../wolverine-peck.component';

describe('WolverinePeck', () => {
	it('renders without crashing', () => {
		const { container } = render(<WolverinePeck side="left" />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('applies the peck class', () => {
		const { container } = render(<WolverinePeck side="left" />);
		expect(container.firstChild).toHaveClass('peck');
	});

	it('applies the left side class', () => {
		const { container } = render(<WolverinePeck side="left" />);
		expect(container.firstChild).toHaveClass('left');
	});

	it('applies the right side class', () => {
		const { container } = render(<WolverinePeck side="right" />);
		expect(container.firstChild).toHaveClass('right');
	});

	it('renders children', () => {
		render(
			<WolverinePeck side="left">
				<span>Arm content</span>
			</WolverinePeck>,
		);
		expect(screen.getByText('Arm content')).toBeInTheDocument();
	});

	it('renders a shoulderpad element', () => {
		const { container } = render(<WolverinePeck side="left" />);
		expect(container.querySelector('.shoulderpad')).toBeInTheDocument();
	});
});
