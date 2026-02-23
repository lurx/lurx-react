import { fireEvent, render, screen } from '@testing-library/react';
import { FileTree } from '../file-tree.component';

const defaultProps = {
	activeFileId: 'bio' as const,
	onFileSelect: jest.fn(),
};

describe('FileTree', () => {
	it('renders the personal-info folder', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('personal-info')).toBeInTheDocument();
	});

	it('renders the work-experience folder', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('work-experience')).toBeInTheDocument();
	});

	it('renders the bio file item', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('bio')).toBeInTheDocument();
	});

	it('renders the interests file item', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('interests')).toBeInTheDocument();
	});

	it('renders the work-experience file items', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('payoneer')).toBeInTheDocument();
		expect(screen.getByText('startup-booster')).toBeInTheDocument();
		expect(screen.getByText('investing-com')).toBeInTheDocument();
		expect(screen.getByText('isocia')).toBeInTheDocument();
	});

	it('calls onFileSelect when a file is clicked', () => {
		const onFileSelect = jest.fn();
		render(<FileTree {...defaultProps} onFileSelect={onFileSelect} />);

		fireEvent.click(screen.getByText('interests'));

		expect(onFileSelect).toHaveBeenCalledWith('interests');
	});

	it('calls onFileSelect when a work-experience file is clicked', () => {
		const onFileSelect = jest.fn();
		render(<FileTree {...defaultProps} onFileSelect={onFileSelect} />);

		fireEvent.click(screen.getByText('payoneer'));

		expect(onFileSelect).toHaveBeenCalledWith('payoneer');
	});

	it('highlights the active file', () => {
		render(<FileTree {...defaultProps} activeFileId="interests" />);
		const interestsButton = screen
			.getByText('interests')
			.closest('button');
		expect(interestsButton?.className).toContain('activeFile');
	});

	it('renders the mobile title', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('renders data-section attributes on section wrappers', () => {
		render(<FileTree {...defaultProps} />);
		const personalInfo = screen.getByText('personal-info').closest('[data-section]');
		expect(personalInfo).toHaveAttribute('data-section', 'personal-info');

		const workExperience = screen.getByText('work-experience').closest('[data-section]');
		expect(workExperience).toHaveAttribute('data-section', 'work-experience');
	});

	it('renders chevron icons on folder rows', () => {
		render(<FileTree {...defaultProps} />);
		const folderButtons = screen.getAllByRole('button', { expanded: true });
		expect(folderButtons.length).toBeGreaterThanOrEqual(2);
	});

	it('collapses a folder when clicking it', () => {
		render(<FileTree {...defaultProps} />);

		fireEvent.click(screen.getByText('personal-info'));

		expect(screen.queryByText('bio')).not.toBeInTheDocument();
		expect(screen.queryByText('interests')).not.toBeInTheDocument();
	});

	it('expands a collapsed folder when clicking it again', () => {
		render(<FileTree {...defaultProps} />);

		fireEvent.click(screen.getByText('personal-info'));
		fireEvent.click(screen.getByText('personal-info'));

		expect(screen.getByText('bio')).toBeInTheDocument();
		expect(screen.getByText('interests')).toBeInTheDocument();
	});

});
