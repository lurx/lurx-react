import { fireEvent, render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { FileTree } from '../file-tree.component';
import { FileTreeSection } from '../components/filte-tree-section.component';
import type { AboutFileId, SectionId } from '../../../data/about-files.data';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

const mockUseResponsive = useResponsive as jest.Mock;

const defaultProps = {
	activeFileId: 'bio' as const,
	onFileSelect: jest.fn(),
};

beforeEach(() => {
	mockUseResponsive.mockReturnValue({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
	});
});

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

	it('does not render the mobile title on desktop', () => {
		render(<FileTree {...defaultProps} />);
		expect(screen.queryByText('_about-me')).not.toBeInTheDocument();
	});

	it('renders the mobile title on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		render(<FileTree {...defaultProps} />);
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('renders folder icons on desktop', () => {
		render(<FileTree {...defaultProps} />);
		const icons = screen.getAllByTestId('icon');
		const folderIcons = icons.filter(
			icon => icon.textContent === 'folder-minus' || icon.textContent === 'folder-plus',
		);
		expect(folderIcons.length).toBeGreaterThanOrEqual(2);
	});

	it('renders chevron icons on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		render(<FileTree {...defaultProps} />);
		const icons = screen.getAllByTestId('icon');
		const chevronIcons = icons.filter(icon => icon.textContent === 'chevron-down');
		expect(chevronIcons.length).toBeGreaterThanOrEqual(2);
	});

	it('renders data-section attributes on section wrappers', () => {
		render(<FileTree {...defaultProps} />);
		const personalInfo = screen.getByText('personal-info').closest('[data-section]');
		expect(personalInfo).toHaveAttribute('data-section', 'personal-info');

		const workExperience = screen.getByText('work-experience').closest('[data-section]');
		expect(workExperience).toHaveAttribute('data-section', 'work-experience');
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

describe('FileTreeSection', () => {
	const sectionProps = {
		id: 'personal-info' as SectionId,
		files: ['unknown-file-id'],
		activeFileId: null as Nullable<AboutFileId>,
		toggleSection: jest.fn(),
		isCollapsed: false,
		onFileSelect: jest.fn(),
		isMobile: false,
	};

	it('falls back to fileId when file title is not found in ABOUT_FILES', () => {
		render(<FileTreeSection {...sectionProps} />);
		expect(screen.getByText('unknown-file-id')).toBeInTheDocument();
	});

	it('renders chevron icon when isMobile is true', () => {
		render(<FileTreeSection {...sectionProps} isMobile={true} />);
		const icons = screen.getAllByTestId('icon');
		const chevronIcon = icons.find(icon => icon.textContent === 'chevron-down');
		expect(chevronIcon).toBeDefined();
	});

	it('applies collapsed class to chevron when isMobile is true and section is collapsed', () => {
		render(<FileTreeSection {...sectionProps} isMobile={true} isCollapsed={true} />);
		const folderButton = screen.getByRole('button', { name: /personal-info/ });
		const chevronSpan = folderButton.querySelector('[class*="folderChevron"]');
		expect(chevronSpan?.className).toContain('collapsed');
	});

	it('does not apply collapsed class to chevron when isMobile is true and section is expanded', () => {
		render(<FileTreeSection {...sectionProps} isMobile={true} isCollapsed={false} />);
		const folderButton = screen.getByRole('button', { name: /personal-info/ });
		const chevronSpan = folderButton.querySelector('[class*="folderChevron"]');
		expect(chevronSpan?.className).not.toContain('collapsed');
	});

	it('renders folder icon when isMobile is false', () => {
		render(<FileTreeSection {...sectionProps} isMobile={false} />);
		const icons = screen.getAllByTestId('icon');
		const folderIcon = icons.find(icon => icon.textContent === 'folder-minus');
		expect(folderIcon).toBeDefined();
	});
});
