import { render, screen } from '@testing-library/react';
import type { Project } from '../../../data/projects.data';
import { ProjectDemoDrawer } from '../project-demo-drawer.component';

jest.mock('@/app/components', () => ({
	ResizableDrawer: ({
		isOpen,
		onClose,
		title,
		ariaLabel,
		children,
	}: {
		isOpen: boolean;
		onClose: () => void;
		title?: React.ReactNode;
		ariaLabel?: string;
		children: React.ReactNode;
	}) =>
		isOpen ? (
			<div
				data-testid="resizable-drawer"
				data-aria-label={ariaLabel}
			>
				{title}
				<button type="button" onClick={onClose} data-testid="close-btn">
					close
				</button>
				{children}
			</div>
		) : null,
}));

const mockProject: Project = {
	id: 1,
	number: 1,
	slug: '_wolverine-css',
	description: 'A CSS art project.',
	technologies: ['CSS', 'HTML'],
};

const defaultProps = {
	project: mockProject as Nullable<Project>,
	onClose: jest.fn(),
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('ProjectDemoDrawer', () => {
	it('renders the drawer when a project is provided', () => {
		render(
			<ProjectDemoDrawer {...defaultProps}>
				<p>Demo content</p>
			</ProjectDemoDrawer>,
		);
		expect(screen.getByTestId('resizable-drawer')).toBeInTheDocument();
	});

	it('renders nothing when project is null', () => {
		render(
			<ProjectDemoDrawer project={null} onClose={defaultProps.onClose}>
				<p>Demo content</p>
			</ProjectDemoDrawer>,
		);
		expect(screen.queryByTestId('resizable-drawer')).not.toBeInTheDocument();
	});

	it('displays the project slug', () => {
		render(
			<ProjectDemoDrawer {...defaultProps}>
				<p>Demo content</p>
			</ProjectDemoDrawer>,
		);
		expect(screen.getByText('_wolverine-css')).toBeInTheDocument();
	});

	it('renders children inside the drawer', () => {
		render(
			<ProjectDemoDrawer {...defaultProps}>
				<p>Custom demo content</p>
			</ProjectDemoDrawer>,
		);
		expect(screen.getByText('Custom demo content')).toBeInTheDocument();
	});

	it('passes the correct aria-label based on the project slug', () => {
		render(
			<ProjectDemoDrawer {...defaultProps}>
				<p>Demo content</p>
			</ProjectDemoDrawer>,
		);
		const drawer = screen.getByTestId('resizable-drawer');
		expect(drawer).toHaveAttribute('data-aria-label', 'Demo: _wolverine-css');
	});

	it('calls onClose when the drawer close is triggered', () => {
		render(
			<ProjectDemoDrawer {...defaultProps}>
				<p>Demo content</p>
			</ProjectDemoDrawer>,
		);
		screen.getByTestId('close-btn').click();
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
	});
});
