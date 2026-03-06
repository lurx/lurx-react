import { render, screen } from '@testing-library/react';
import { MoonDemo } from '../moon.demo';

jest.mock('@/app/components', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="flex">{children}</div>
	),
	Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

jest.mock('../../demo-container/demo-container.component', () => ({
	DemoContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="demo-container">{children}</div>
	),
}));

describe('MoonDemo', () => {
	it('renders without crashing', () => {
		render(<MoonDemo />);
		expect(screen.getByTestId('demo-container')).toBeInTheDocument();
	});

	it('renders credits with attribution links', () => {
		render(<MoonDemo />);
		expect(screen.getByText('Moon')).toBeInTheDocument();
		expect(screen.getByText('Julien')).toBeInTheDocument();
	});

	it('renders the project link with correct href', () => {
		render(<MoonDemo />);
		const projectLink = screen.getByText('Moon').closest('a');
		expect(projectLink).toHaveAttribute(
			'href',
			'https://dribbble.com/shots/5834247-Moon',
		);
	});

	it('renders the author link with correct href', () => {
		render(<MoonDemo />);
		const authorLink = screen.getByText('Julien').closest('a');
		expect(authorLink).toHaveAttribute(
			'href',
			'https://dribbble.com/julienc',
		);
	});

	it('renders moon structure with moon and craters', () => {
		const { container } = render(<MoonDemo />);
		expect(container.querySelector('.moon')).toBeInTheDocument();
		expect(container.querySelector('.moon-wrapper')).toBeInTheDocument();
	});

	it('renders correct number of craters', () => {
		const { container } = render(<MoonDemo />);
		const craters = container.querySelectorAll('.moon-crater');
		expect(craters).toHaveLength(3);
	});

	it('renders correct number of comets', () => {
		const { container } = render(<MoonDemo />);
		const comets = container.querySelectorAll('.comet');
		expect(comets).toHaveLength(6);
	});

	it('renders correct number of stars', () => {
		const { container } = render(<MoonDemo />);
		const stars = container.querySelectorAll('.star');
		expect(stars).toHaveLength(50);
	});

	it('renders cloud groups', () => {
		const { container } = render(<MoonDemo />);
		const clouds = container.querySelectorAll('.cloud');
		expect(clouds).toHaveLength(22);
	});
});
