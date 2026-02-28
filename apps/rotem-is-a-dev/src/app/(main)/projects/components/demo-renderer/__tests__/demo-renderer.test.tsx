import { render, screen } from '@testing-library/react';
import { DemoRenderer } from '../demo-renderer.component';

describe('DemoRenderer', () => {
	it('renders null when demo is null', () => {
		const { container } = render(<DemoRenderer demo={null} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders the demo component when demo is provided', () => {
		const MockDemo = () => <div data-testid="mock-demo">Demo Content</div>;
		render(<DemoRenderer demo={MockDemo} />);
		expect(screen.getByTestId('mock-demo')).toBeInTheDocument();
	});

	it('renders the correct content from the demo component', () => {
		const MockDemo = () => <p>My project demo</p>;
		render(<DemoRenderer demo={MockDemo} />);
		expect(screen.getByText('My project demo')).toBeInTheDocument();
	});

	it('renders different demo components correctly', () => {
		const DemoA = () => <span data-testid="demo-a">Demo A</span>;
		const DemoB = () => <span data-testid="demo-b">Demo B</span>;

		const { rerender } = render(<DemoRenderer demo={DemoA} />);
		expect(screen.getByTestId('demo-a')).toBeInTheDocument();
		expect(screen.queryByTestId('demo-b')).not.toBeInTheDocument();

		rerender(<DemoRenderer demo={DemoB} />);
		expect(screen.getByTestId('demo-b')).toBeInTheDocument();
		expect(screen.queryByTestId('demo-a')).not.toBeInTheDocument();
	});

	it('switches from demo to null correctly', () => {
		const MockDemo = () => <div data-testid="mock-demo">Demo</div>;
		const { rerender } = render(<DemoRenderer demo={MockDemo} />);
		expect(screen.getByTestId('mock-demo')).toBeInTheDocument();

		rerender(<DemoRenderer demo={null} />);
		expect(screen.queryByTestId('mock-demo')).not.toBeInTheDocument();
	});
});
