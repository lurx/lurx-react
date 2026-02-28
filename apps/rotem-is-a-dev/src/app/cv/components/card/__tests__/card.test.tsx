import { render, screen } from '@testing-library/react';
import { Card } from '../card.component';

describe('Card', () => {
	it('renders children', () => {
		render(<Card>Card content</Card>);
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('renders as a div element', () => {
		const { container } = render(<Card>Content</Card>);
		expect(container.firstChild?.nodeName).toBe('DIV');
	});

	it('applies the card CSS class', () => {
		const { container } = render(<Card>Content</Card>);
		const div = container.firstChild as HTMLDivElement;
		expect(div.className).toMatch(/card/);
	});

	it('sets the id attribute when provided', () => {
		const { container } = render(<Card id="my-card">Content</Card>);
		const div = container.firstChild as HTMLDivElement;
		expect(div.id).toBe('my-card');
	});

	it('does not set id when not provided', () => {
		const { container } = render(<Card>No ID</Card>);
		const div = container.firstChild as HTMLDivElement;
		expect(div.id).toBe('');
	});

	it('renders multiple children', () => {
		render(
			<Card>
				<span>First</span>
				<span>Second</span>
			</Card>,
		);
		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getByText('Second')).toBeInTheDocument();
	});
});
