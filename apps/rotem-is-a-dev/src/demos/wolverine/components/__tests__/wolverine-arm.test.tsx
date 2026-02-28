import { render } from '@testing-library/react';
import { WolverineArm } from '../wolverine-arm.component';

describe('WolverineArm', () => {
	it('renders without crashing', () => {
		const { container } = render(<WolverineArm side="left" />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('applies the side class for left', () => {
		const { container } = render(<WolverineArm side="left" />);
		expect(container.firstChild).toHaveClass('left');
	});

	it('applies the side class for right', () => {
		const { container } = render(<WolverineArm side="right" />);
		expect(container.firstChild).toHaveClass('right');
	});

	it('renders four finger elements', () => {
		const { container } = render(<WolverineArm side="left" />);
		const fingers = container.querySelectorAll('.finger');
		expect(fingers).toHaveLength(4);
	});

	it('renders three claw elements', () => {
		const { container } = render(<WolverineArm side="left" />);
		const claws = container.querySelectorAll('.wolverine-claw');
		expect(claws).toHaveLength(3);
	});

	it('contains a forearm element', () => {
		const { container } = render(<WolverineArm side="left" />);
		expect(container.querySelector('.forearm')).toBeInTheDocument();
	});

	it('contains a fist element', () => {
		const { container } = render(<WolverineArm side="left" />);
		expect(container.querySelector('.fist')).toBeInTheDocument();
	});
});
