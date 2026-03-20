import { act, fireEvent, render, screen } from '@testing-library/react';
import { CommentForm } from '../comment-form.component';

const mockOnSubmit = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
	mockOnSubmit.mockResolvedValue(undefined);
});

describe('CommentForm', () => {
	it('renders the form', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.getByTestId('comment-form')).toBeInTheDocument();
	});

	it('renders the textarea with placeholder', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.getByTestId('comment-textarea')).toHaveAttribute(
			'placeholder',
			'Write a comment...',
		);
	});

	it('renders the submit button', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.getByTestId('comment-submit')).toHaveTextContent('Post');
	});

	it('renders textarea with name attribute for FormData', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.getByTestId('comment-textarea')).toHaveAttribute('name', 'comment');
	});

	it('calls onSubmitAction with trimmed text on form submission', async () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		fireEvent.change(screen.getByTestId('comment-textarea'), {
			target: { value: '  Hello!  ' },
		});

		await act(async () => {
			fireEvent.submit(screen.getByTestId('comment-form'));
		});

		expect(mockOnSubmit).toHaveBeenCalledWith('Hello!');
	});

	it('resets the form after successful submission', async () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		fireEvent.change(screen.getByTestId('comment-textarea'), {
			target: { value: 'Hello!' },
		});

		await act(async () => {
			fireEvent.submit(screen.getByTestId('comment-form'));
		});

		expect(screen.getByTestId('comment-textarea')).toHaveValue('');
	});

	it('does not call onSubmitAction when textarea is empty', async () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);

		await act(async () => {
			fireEvent.submit(screen.getByTestId('comment-form'));
		});

		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it('does not call onSubmitAction when textarea has only whitespace', async () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		fireEvent.change(screen.getByTestId('comment-textarea'), {
			target: { value: '   ' },
		});

		await act(async () => {
			fireEvent.submit(screen.getByTestId('comment-form'));
		});

		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it('shows error message when submission fails', async () => {
		mockOnSubmit.mockRejectedValue(new Error('Network error'));

		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		fireEvent.change(screen.getByTestId('comment-textarea'), {
			target: { value: 'Hello!' },
		});

		await act(async () => {
			fireEvent.submit(screen.getByTestId('comment-form'));
		});

		expect(screen.getByTestId('comment-form-error')).toHaveTextContent(
			'Failed to post comment. Please try again.',
		);
	});

	it('does not show error message initially', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.queryByTestId('comment-form-error')).not.toBeInTheDocument();
	});

	it('does not show error message after successful submission', async () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		fireEvent.change(screen.getByTestId('comment-textarea'), {
			target: { value: 'Hello!' },
		});

		await act(async () => {
			fireEvent.submit(screen.getByTestId('comment-form'));
		});

		expect(screen.queryByTestId('comment-form-error')).not.toBeInTheDocument();
	});

	it('sets maxLength on textarea', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.getByTestId('comment-textarea')).toHaveAttribute('maxLength', '2000');
	});

	it('renders submit button as type submit', () => {
		render(<CommentForm onSubmitAction={mockOnSubmit} />);
		expect(screen.getByTestId('comment-submit')).toHaveAttribute('type', 'submit');
	});
});
