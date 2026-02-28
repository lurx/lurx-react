import { render } from '@testing-library/react';
import { WolverineFace } from '../wolverine-face.component';

describe('WolverineFace', () => {
	it('renders without crashing', () => {
		const { container } = render(<WolverineFace />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('renders a face element', () => {
		const { container } = render(<WolverineFace />);
		expect(container.querySelector('.face')).toBeInTheDocument();
	});

	it('renders a mouth element', () => {
		const { container } = render(<WolverineFace />);
		expect(container.querySelector('.mouth')).toBeInTheDocument();
	});

	it('renders a tongue element', () => {
		const { container } = render(<WolverineFace />);
		expect(container.querySelector('.tongue')).toBeInTheDocument();
	});

	it('renders a teeth element', () => {
		const { container } = render(<WolverineFace />);
		expect(container.querySelector('.teeth')).toBeInTheDocument();
	});
});
