import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorPageButton } from '../error-page-button.component';

describe('ErrorPageButton', () => {
	it('renders a button with the text "Try again"', () => {
		render(<ErrorPageButton reset={jest.fn()} />);
		expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
	});

	it('calls reset when the button is clicked', () => {
		const reset = jest.fn();
		render(<ErrorPageButton reset={reset} />);
		fireEvent.click(screen.getByRole('button'));
		expect(reset).toHaveBeenCalledTimes(1);
	});

	it('calls reset each time the button is clicked', () => {
		const reset = jest.fn();
		render(<ErrorPageButton reset={reset} />);
		fireEvent.click(screen.getByRole('button'));
		fireEvent.click(screen.getByRole('button'));
		expect(reset).toHaveBeenCalledTimes(2);
	});

	it('renders only one button', () => {
		render(<ErrorPageButton reset={jest.fn()} />);
		expect(screen.getAllByRole('button')).toHaveLength(1);
	});
});
