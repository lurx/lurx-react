import { fireEvent, render, screen } from '@testing-library/react';
import { FileTreeSection } from '../file-tree-section.component';
import type { AboutFileId, SectionId } from '../../../../../data/about-files.data';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

const defaultProps = {
	id: 'personal-info' as SectionId,
	files: ['bio', 'interests'] as AboutFileId[],
	activeFileId: null as Nullable<AboutFileId>,
	toggleSection: jest.fn(),
	isCollapsed: false,
	onFileSelect: jest.fn(),
	isMobile: false,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('FileTreeSection', () => {
	it('renders the section id as the folder label', () => {
		render(<FileTreeSection {...defaultProps} />);
		expect(screen.getByText('personal-info')).toBeInTheDocument();
	});

	it('renders a folder button', () => {
		render(<FileTreeSection {...defaultProps} />);
		expect(screen.getByRole('button', { name: /personal-info/ })).toBeInTheDocument();
	});

	it('sets aria-expanded to true when not collapsed', () => {
		render(<FileTreeSection {...defaultProps} isCollapsed={false} />);
		expect(screen.getByRole('button', { name: /personal-info/ })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
	});

	it('sets aria-expanded to false when collapsed', () => {
		render(<FileTreeSection {...defaultProps} isCollapsed={true} />);
		expect(screen.getByRole('button', { name: /personal-info/ })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
	});

	it('renders file items when not collapsed', () => {
		render(<FileTreeSection {...defaultProps} isCollapsed={false} />);
		expect(screen.getByText('bio')).toBeInTheDocument();
		expect(screen.getByText('interests')).toBeInTheDocument();
	});

	it('hides file items when collapsed', () => {
		render(<FileTreeSection {...defaultProps} isCollapsed={true} />);
		expect(screen.queryByText('bio')).not.toBeInTheDocument();
		expect(screen.queryByText('interests')).not.toBeInTheDocument();
	});

	it('calls toggleSection with the section id when folder button is clicked', () => {
		const toggleSection = jest.fn();
		render(<FileTreeSection {...defaultProps} toggleSection={toggleSection} />);
		fireEvent.click(screen.getByRole('button', { name: /personal-info/ }));
		expect(toggleSection).toHaveBeenCalledWith('personal-info');
	});

	it('calls onFileSelect with the file id when a file is clicked', () => {
		const onFileSelect = jest.fn();
		render(<FileTreeSection {...defaultProps} onFileSelect={onFileSelect} />);
		fireEvent.click(screen.getByText('bio').closest('button')!);
		expect(onFileSelect).toHaveBeenCalledWith('bio');
	});

	it('marks the active file', () => {
		render(<FileTreeSection {...defaultProps} activeFileId={'bio' as AboutFileId} />);
		const bioButton = screen.getByText('bio').closest('button');
		expect(bioButton?.className).toContain('activeFile');
	});

	it('does not mark a non-active file', () => {
		render(<FileTreeSection {...defaultProps} activeFileId={'interests' as AboutFileId} />);
		const bioButton = screen.getByText('bio').closest('button');
		expect(bioButton?.className).not.toContain('activeFile');
	});

	it('renders folder-minus icon on desktop when expanded', () => {
		render(<FileTreeSection {...defaultProps} isMobile={false} isCollapsed={false} />);
		const icons = screen.getAllByTestId('icon');
		expect(icons.some(icon => icon.textContent === 'folder-minus')).toBe(true);
	});

	it('renders folder-plus icon on desktop when collapsed', () => {
		render(<FileTreeSection {...defaultProps} isMobile={false} isCollapsed={true} />);
		const icons = screen.getAllByTestId('icon');
		expect(icons.some(icon => icon.textContent === 'folder-plus')).toBe(true);
	});

	it('renders chevron-down icon on mobile', () => {
		render(<FileTreeSection {...defaultProps} isMobile={true} />);
		const icons = screen.getAllByTestId('icon');
		expect(icons.some(icon => icon.textContent === 'chevron-down')).toBe(true);
	});

	it('applies collapsed class to chevron when mobile and collapsed', () => {
		render(<FileTreeSection {...defaultProps} isMobile={true} isCollapsed={true} />);
		const folderButton = screen.getByRole('button', { name: /personal-info/ });
		const chevronSpan = folderButton.querySelector('[class*="folderChevron"]');
		expect(chevronSpan?.className).toContain('collapsed');
	});

	it('does not apply collapsed class to chevron when mobile and expanded', () => {
		render(<FileTreeSection {...defaultProps} isMobile={true} isCollapsed={false} />);
		const folderButton = screen.getByRole('button', { name: /personal-info/ });
		const chevronSpan = folderButton.querySelector('[class*="folderChevron"]');
		expect(chevronSpan?.className).not.toContain('collapsed');
	});

	it('attaches data-section attribute with the section id', () => {
		render(<FileTreeSection {...defaultProps} />);
		const section = screen.getByText('personal-info').closest('[data-section]');
		expect(section).toHaveAttribute('data-section', 'personal-info');
	});

	it('falls back to fileId when file title is not in ABOUT_FILES', () => {
		render(
			<FileTreeSection
				{...defaultProps}
				files={['unknown-file-id']}
			/>,
		);
		expect(screen.getByText('unknown-file-id')).toBeInTheDocument();
	});
});
