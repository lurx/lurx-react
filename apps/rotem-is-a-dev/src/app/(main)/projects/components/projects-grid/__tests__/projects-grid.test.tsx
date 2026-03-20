import { fireEvent, render, screen } from '@testing-library/react';
import type { Project } from '../../../data/projects.data';
import { ProjectsGrid } from '../projects-grid.component';

jest.mock('../../project-card', () => ({
	ProjectCard: ({
		project,
		onViewProjectAction,
	}: {
		project: Project;
		onViewProjectAction?: (project: Project) => void;
	}) => (
		<div
			data-testid={`project-card-${project.id}`}
			data-slug={project.slug}
		>
			<span>{project.slug}</span>
			{onViewProjectAction && (
				<button onClick={() => onViewProjectAction(project)}>view</button>
			)}
		</div>
	),
}));

const mockProjects: Project[] = [
	{
		id: 1,
		number: 1,
		slug: '_project-one',
		description: 'First project.',
		technologies: ['react', 'typescript'],
	},
	{
		id: 2,
		number: 2,
		slug: '_project-two',
		description: 'Second project.',
		technologies: ['css', 'scss'],
	},
];

describe('ProjectsGrid', () => {
	it('renders a ProjectCard for each project', () => {
		render(<ProjectsGrid projects={mockProjects} />);
		expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
		expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
	});

	it('renders slug text inside each card', () => {
		render(<ProjectsGrid projects={mockProjects} />);
		expect(screen.getByText('_project-one')).toBeInTheDocument();
		expect(screen.getByText('_project-two')).toBeInTheDocument();
	});

	it('renders the empty state message when projects array is empty', () => {
		render(<ProjectsGrid projects={[]} />);
		expect(
			screen.getByText('// no projects found for the selected technologies'),
		).toBeInTheDocument();
	});

	it('does not render any project cards when projects is empty', () => {
		render(<ProjectsGrid projects={[]} />);
		expect(screen.queryByTestId('project-card-1')).not.toBeInTheDocument();
	});

	it('passes onViewProject to each ProjectCard', () => {
		const onViewProject = jest.fn();
		render(<ProjectsGrid projects={mockProjects} onViewProjectAction={onViewProject} />);
		fireEvent.click(screen.getAllByText('view')[0]);
		expect(onViewProject).toHaveBeenCalledWith(mockProjects[0]);
	});

	it('calls onViewProject with the correct project when clicked', () => {
		const onViewProject = jest.fn();
		render(<ProjectsGrid projects={mockProjects} onViewProjectAction={onViewProject} />);
		fireEvent.click(screen.getAllByText('view')[1]);
		expect(onViewProject).toHaveBeenCalledWith(mockProjects[1]);
	});

	it('renders a single project correctly', () => {
		render(<ProjectsGrid projects={[mockProjects[0]]} />);
		expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
		expect(screen.queryByTestId('project-card-2')).not.toBeInTheDocument();
	});

	it('wraps everything in a container div', () => {
		const { container } = render(<ProjectsGrid projects={mockProjects} />);
		expect(container.firstChild).not.toBeNull();
		expect((container.firstChild as HTMLElement).tagName).toBe('DIV');
	});
});
