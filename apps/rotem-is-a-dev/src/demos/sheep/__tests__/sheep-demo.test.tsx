import { render, screen } from '@testing-library/react';
import { SheepDemo } from '../sheep.demo';

jest.mock('@/app/components', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="flex">{children}</div>
	),
	Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

jest.mock('next/font/google', () => ({
	Bangers: () => ({
		variable: 'mock-bangers-variable',
	}),
}));

jest.mock('../../demo-container/demo-container.component', () => ({
	DemoContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="demo-container">{children}</div>
	),
}));

describe('SheepDemo', () => {
	it('renders without crashing', () => {
		render(<SheepDemo />);
		expect(screen.getByTestId('demo-container')).toBeInTheDocument();
	});

	it('renders the Baaaa! text', () => {
		render(<SheepDemo />);
		expect(screen.getByText('Baaaa!')).toBeInTheDocument();
	});

	it('renders credits with attribution links', () => {
		render(<SheepDemo />);
		// cspell:disable-next-line
		expect(screen.getByText('BAAAHHHHH')).toBeInTheDocument();
		expect(screen.getByText('Gregory Hartman')).toBeInTheDocument();
	});

	it('renders the project link with correct href', () => {
		render(<SheepDemo />);
		// cspell:disable-next-line
		const projectLink = screen.getByText('BAAAHHHHH').closest('a');
		// cspell:disable-next-line
		expect(projectLink).toHaveAttribute('href', 'https://dribbble.com/shots/6204781-BAAAHHHHH');
	});

	it('renders the author link with correct href', () => {
		render(<SheepDemo />);
		const authorLink = screen.getByText('Gregory Hartman').closest('a');
		expect(authorLink).toHaveAttribute('href', 'https://dribbble.com/gregoryhartman');
	});

	it('renders the sheep structure with head and face elements', () => {
		const { container } = render(<SheepDemo />);
		expect(container.querySelector('.head')).toBeInTheDocument();
		expect(container.querySelector('.face')).toBeInTheDocument();
	});

	it('renders both eyes', () => {
		const { container } = render(<SheepDemo />);
		const eyes = container.querySelectorAll('.eye');
		expect(eyes).toHaveLength(2);
	});

	it('renders both ears', () => {
		const { container } = render(<SheepDemo />);
		const ears = container.querySelectorAll('.ear');
		expect(ears).toHaveLength(2);
	});

	it('renders two leaf elements', () => {
		const { container } = render(<SheepDemo />);
		const leaves = container.querySelectorAll('.leaf');
		expect(leaves).toHaveLength(2);
	});
});
