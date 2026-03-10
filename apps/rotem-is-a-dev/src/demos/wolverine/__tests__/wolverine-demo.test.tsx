import { render, screen } from '@testing-library/react';
import { WolverineDemo } from '../wolverine.demo';

jest.mock('@/app/components', () => ({
	Flex: ({ children, ...props }: { children: React.ReactNode; gap?: string; justify?: string }) => (
		<div data-testid="flex" data-gap={props.gap} data-justify={props.justify}>{children}</div>
	),
	Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

jest.mock('next/font/google', () => ({
	Chelsea_Market: () => ({
		variable: 'mock-chelsea-market-variable',
	}),
}));

jest.mock('../../demo-container/demo-container.component', () => ({
	DemoContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="demo-container">{children}</div>
	),
}));

jest.mock('../components', () => ({
	WolverineCowl: () => <div data-testid="wolverine-cowl" />,
}));

jest.mock('../components/wolverine-arm.component', () => ({
	WolverineArm: ({ side }: { side: string }) => (
		<div data-testid={`wolverine-arm-${side}`} />
	),
}));

describe('WolverineDemo', () => {
	it('renders without crashing', () => {
		render(<WolverineDemo />);
		expect(screen.getByTestId('demo-container')).toBeInTheDocument();
	});

	it('renders the wolverine cowl', () => {
		render(<WolverineDemo />);
		expect(screen.getByTestId('wolverine-cowl')).toBeInTheDocument();
	});

	it('renders both left and right arms', () => {
		render(<WolverineDemo />);
		expect(screen.getByTestId('wolverine-arm-left')).toBeInTheDocument();
		expect(screen.getByTestId('wolverine-arm-right')).toBeInTheDocument();
	});

	it('renders the Snikt! text on both sides', () => {
		const sniktElements = screen.queryAllByText('Snikt!');
		render(<WolverineDemo />);
		const rendered = screen.getAllByText('Snikt!');
		expect(rendered).toHaveLength(2);
	});

	it('renders credits with attribution links', () => {
		render(<WolverineDemo />);
		expect(screen.getByText('Wolverine')).toBeInTheDocument();
		expect(screen.getByText('Gregory Hartman')).toBeInTheDocument();
	});

	it('renders credits links with correct hrefs', () => {
		render(<WolverineDemo />);
		const wolverineLink = screen.getByText('Wolverine').closest('a');
		const authorLink = screen.getByText('Gregory Hartman').closest('a');
		expect(wolverineLink).toHaveAttribute('href', 'https://dribbble.com/shots/2047572-Wolverine');
		expect(authorLink).toHaveAttribute('href', 'https://dribbble.com/gregoryhartman');
	});

});
