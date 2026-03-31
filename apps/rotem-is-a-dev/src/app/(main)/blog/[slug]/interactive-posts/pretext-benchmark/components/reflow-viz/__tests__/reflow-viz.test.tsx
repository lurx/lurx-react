import { render, screen } from '@testing-library/react';
import { ReflowViz } from '../reflow-viz.component';

describe('ReflowViz', () => {
	it('renders the Component A row label', () => {
		render(<ReflowViz />);
		expect(screen.getByText('Component A')).toBeInTheDocument();
	});

	it('renders the Component B row label', () => {
		render(<ReflowViz />);
		expect(screen.getByText('Component B')).toBeInTheDocument();
	});

	it('renders the DOM write legend item', () => {
		render(<ReflowViz />);
		expect(screen.getByText('DOM write')).toBeInTheDocument();
	});

	it('renders the getBoundingClientRect legend item', () => {
		render(<ReflowViz />);
		expect(screen.getByText('getBoundingClientRect / offsetHeight')).toBeInTheDocument();
	});

	it('renders the forced synchronous layout legend item', () => {
		render(<ReflowViz />);
		expect(screen.getByText('forced synchronous layout')).toBeInTheDocument();
	});

	it('renders write DOM block labels', () => {
		render(<ReflowViz />);
		expect(screen.getAllByText('write DOM')).toHaveLength(2);
	});

	it('renders REFLOW block labels', () => {
		render(<ReflowViz />);
		expect(screen.getAllByText('REFLOW')).toHaveLength(2);
	});
});
