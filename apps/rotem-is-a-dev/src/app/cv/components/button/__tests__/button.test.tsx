import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../button.component';

describe('Button', () => {
	it('renders children', () => {
		render(<Button onClick={jest.fn()}>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('renders a button element', () => {
		render(<Button onClick={jest.fn()}>Label</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('calls onClick when clicked', () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('applies the primary variant class by default', () => {
		const { container } = render(<Button onClick={jest.fn()}>Primary</Button>);
		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.className).toMatch(/button-primary/);
	});

	it('applies the secondary variant class', () => {
		const { container } = render(
			<Button variant="secondary" onClick={jest.fn()}>Secondary</Button>,
		);
		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.className).toMatch(/button-secondary/);
	});

	it('applies the ghost variant class', () => {
		const { container } = render(
			<Button variant="ghost" onClick={jest.fn()}>Ghost</Button>,
		);
		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.className).toMatch(/button-ghost/);
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button onClick={jest.fn()} disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('is not disabled by default', () => {
		render(<Button onClick={jest.fn()}>Enabled</Button>);
		expect(screen.getByRole('button')).not.toBeDisabled();
	});

	it('does not call onClick when disabled', () => {
		const handleClick = jest.fn();
		render(
			<Button onClick={handleClick} disabled>Disabled</Button>,
		);
		fireEvent.click(screen.getByRole('button'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('applies the base button class', () => {
		const { container } = render(<Button onClick={jest.fn()}>Base</Button>);
		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.className).toMatch(/button/);
	});
});
