import { fireEvent, render, screen } from '@testing-library/react';
import { FileTree } from '../file-tree.component';

const defaultProps = {
	activeFileId: 'bio' as const,
	onFileSelect: jest.fn(),
};

describe('FileTree', () => {
	it('renders the personal-info section header', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('personal-info')).toBeInTheDocument();
	});

	it('renders the contacts section header', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('contacts')).toBeInTheDocument();
	});

	it('renders the bio file item', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('bio')).toBeInTheDocument();
	});

	it('renders the interests file item', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('interests')).toBeInTheDocument();
	});

	it('calls onFileSelect when a file is clicked', () => {
		const onFileSelect = jest.fn();
		render(<FileTree {...defaultProps} onFileSelect={onFileSelect} />);

		fireEvent.click(screen.getByText('interests'));

		expect(onFileSelect).toHaveBeenCalledWith('interests');
	});

	it('highlights the active file', () => {
		render(<FileTree {...defaultProps} activeFileId="interests" />);
		const interestsButton = screen
			.getByText('interests')
			.closest('button');
		expect(interestsButton?.className).toContain('activeFile');
	});

	it('renders the email contact', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('lurxie@gmail.com')).toBeInTheDocument();
	});

	it('renders the phone contact', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('(+972) 052 522 9225')).toBeInTheDocument();
	});
});
