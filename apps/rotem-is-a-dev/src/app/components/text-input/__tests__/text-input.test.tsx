import { fireEvent, render, screen } from '@testing-library/react';
import { TextInput } from '../text-input.component';

describe('TextInput', () => {
	it('renders the label', () => {
		render(
			<TextInput
				label="_search:"
				value=""
				onChange={() => undefined}
			/>,
		);
		expect(screen.getByText('_search:')).toBeInTheDocument();
	});

	it('renders a text input', () => {
		render(
			<TextInput
				label="_name:"
				value=""
				onChange={() => undefined}
			/>,
		);
		const input = screen.getByRole('textbox', { name: /_name:/ });
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('associates the label with the input', () => {
		render(
			<TextInput
				label="_search:"
				value=""
				onChange={() => undefined}
			/>,
		);
		const input = screen.getByLabelText('_search:');
		expect(input.tagName).toBe('INPUT');
	});

	it('displays the current value', () => {
		render(
			<TextInput
				label="_name:"
				value="Jonathan"
				onChange={() => undefined}
			/>,
		);
		expect(screen.getByDisplayValue('Jonathan')).toBeInTheDocument();
	});

	it('calls onChange when text is entered', () => {
		const onChange = jest.fn();
		render(
			<TextInput
				label="_name:"
				value=""
				onChange={onChange}
			/>,
		);
		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: 'test' },
		});
		expect(onChange).toHaveBeenCalled();
	});

	it('passes through placeholder', () => {
		render(
			<TextInput
				label="_name:"
				value=""
				placeholder="Type here..."
				onChange={() => undefined}
			/>,
		);
		expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
	});
});
