import { render } from '@testing-library/react';
import { WolverineCowl, WolverineCowlSide } from '../wolverine-cowl.component';

describe('WolverineCowlSide', () => {
	it('renders without crashing', () => {
		const { container } = render(<WolverineCowlSide side="left" />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('applies the cowl-left class for left side', () => {
		const { container } = render(<WolverineCowlSide side="left" />);
		expect(container.firstChild).toHaveClass('cowl-left');
	});

	it('applies the cowl-right class for right side', () => {
		const { container } = render(<WolverineCowlSide side="right" />);
		expect(container.firstChild).toHaveClass('cowl-right');
	});

	it('renders an eye element', () => {
		const { container } = render(<WolverineCowlSide side="left" />);
		expect(container.querySelector('.eye')).toBeInTheDocument();
	});
});

describe('WolverineCowl', () => {
	it('renders without crashing', () => {
		const { container } = render(<WolverineCowl />);
		expect(container).toBeInTheDocument();
	});

	it('renders both left and right cowl sides', () => {
		const { container } = render(<WolverineCowl />);
		expect(container.querySelector('.cowl-left')).toBeInTheDocument();
		expect(container.querySelector('.cowl-right')).toBeInTheDocument();
	});

	it('renders two eye elements', () => {
		const { container } = render(<WolverineCowl />);
		const eyes = container.querySelectorAll('.eye');
		expect(eyes).toHaveLength(2);
	});
});
