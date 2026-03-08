import { fireEvent, render, screen } from '@testing-library/react';
import type { Project } from '../../../data/projects.data';

jest.mock('../components', () => ({
	ProjectCardFooter: ({
		entityType,
		entityId,
		onCommentClick,
		onViewClick,
	}: {
		entityType: string;
		entityId: string;
		onCommentClick: () => void;
		onViewClick?: () => void;
	}) => (
		<div
			data-testid="project-card-footer"
			data-entity-type={entityType}
			data-entity-id={entityId}
		>
			<button type="button" onClick={onCommentClick} data-testid="footer-comment-button">
				comment
			</button>
			{onViewClick && (
				<button
					type="button"
					onClick={onViewClick}
					aria-label="View project"
					data-testid="footer-view-button"
				>
					view-project
				</button>
			)}
		</div>
	),
}));

import { ProjectCard } from '../project-card.component';

const mockProject: Project = {
	id: 1,
	number: 1,
	slug: '_ui-animations',
	description: 'A test project description.',
	technologies: ['react', 'typescript'],
};

describe('ProjectCard', () => {
	it('renders the project number', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByText('Project 1')).toBeInTheDocument();
	});

	it('renders the project slug', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByText('_ui-animations')).toBeInTheDocument();
	});

	it('renders the project description', () => {
		render(<ProjectCard project={mockProject} />);
		expect(
			screen.getByText('A test project description.'),
		).toBeInTheDocument();
	});

	it('renders with article role', () => {
		render(<ProjectCard project={mockProject} />);
		expect(
			screen.getByRole('article', { name: /project: _ui-animations/i }),
		).toBeInTheDocument();
	});

	it('renders the tech badge when primary technology has an icon mapping', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByLabelText('react')).toBeInTheDocument();
	});

	it('renders without a tech badge when technology has no icon mapping', () => {
		const project: Project = {
			...mockProject,
			technologies: ['scss'],
		};
		render(<ProjectCard project={project} />);
		expect(screen.queryByLabelText('scss')).not.toBeInTheDocument();
	});

	it('renders without tech badge when technologies array is empty', () => {
		const project: Project = {
			...mockProject,
			technologies: [],
		};
		render(<ProjectCard project={project} />);
		expect(screen.queryByLabelText('react')).not.toBeInTheDocument();
	});

	describe('demo preview', () => {
		it('renders the demo component when project has a demo', () => {
			const MockDemo = () => <div data-testid="mock-demo">Demo Content</div>;
			const project: Project = { ...mockProject, demo: MockDemo };
			render(<ProjectCard project={project} />);
			expect(screen.getByTestId('mock-demo')).toBeInTheDocument();
		});

		it('hides the demo preview from assistive technology', () => {
			const MockDemo = () => <div>Demo</div>;
			const project: Project = { ...mockProject, demo: MockDemo };
			const { container } = render(<ProjectCard project={project} />);
			const preview = container.querySelector('[aria-hidden="true"]');
			expect(preview).toBeInTheDocument();
		});

		it('renders the placeholder when project has no demo', () => {
			const { container } = render(<ProjectCard project={mockProject} />);
			expect(container.querySelector('[data-testid="mock-demo"]')).not.toBeInTheDocument();
		});
	});

	describe('with onViewProject', () => {
		it('renders the view button in the footer', () => {
			const onViewProject = jest.fn();
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onViewProject={onViewProject} onCommentClick={onCommentClick} />);
			expect(screen.getByTestId('footer-view-button')).toBeInTheDocument();
		});

		it('calls onViewProject with the project when the button is clicked', () => {
			const onViewProject = jest.fn();
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onViewProject={onViewProject} onCommentClick={onCommentClick} />);
			fireEvent.click(screen.getByTestId('footer-view-button'));
			expect(onViewProject).toHaveBeenCalledWith(mockProject);
		});

		it('calls onViewProject exactly once per click', () => {
			const onViewProject = jest.fn();
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onViewProject={onViewProject} onCommentClick={onCommentClick} />);
			fireEvent.click(screen.getByTestId('footer-view-button'));
			expect(onViewProject).toHaveBeenCalledTimes(1);
		});

		it('does not render footer view button without onViewProject', () => {
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onCommentClick={onCommentClick} />);
			expect(screen.queryByTestId('footer-view-button')).not.toBeInTheDocument();
		});
	});

	describe('with onCommentClick', () => {
		it('renders the project card footer', () => {
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onCommentClick={onCommentClick} />);
			expect(screen.getByTestId('project-card-footer')).toBeInTheDocument();
		});

		it('does not render footer without onCommentClick', () => {
			render(<ProjectCard project={mockProject} />);
			expect(screen.queryByTestId('project-card-footer')).not.toBeInTheDocument();
		});

		it('passes correct entityType and entityId to footer', () => {
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onCommentClick={onCommentClick} />);
			const footer = screen.getByTestId('project-card-footer');
			expect(footer).toHaveAttribute('data-entity-type', 'project');
			expect(footer).toHaveAttribute('data-entity-id', '1');
		});

		it('calls onCommentClick with the project when footer comment is clicked', () => {
			const onCommentClick = jest.fn();
			render(<ProjectCard project={mockProject} onCommentClick={onCommentClick} />);
			fireEvent.click(screen.getByTestId('footer-comment-button'));
			expect(onCommentClick).toHaveBeenCalledWith(mockProject);
		});
	});
});
