import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectCard } from '../project-card.component';
import type { Project } from '../../../data/projects.data';

const mockProject: Project = {
	id: 1,
	number: 1,
	slug: '_ui-animations',
	description: 'A test project description.',
	technologies: ['React', 'TypeScript'],
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

	it('does not render view-project button without onViewProject', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.queryByText('view-project')).not.toBeInTheDocument();
	});

	it('renders with article role', () => {
		render(<ProjectCard project={mockProject} />);
		expect(
			screen.getByRole('article', { name: /project: _ui-animations/i }),
		).toBeInTheDocument();
	});

	it('renders without a tech badge when technology has no icon mapping', () => {
		const project: Project = {
			...mockProject,
			technologies: ['SCSS'],
		};
		render(<ProjectCard project={project} />);
		expect(screen.queryByLabelText('SCSS')).not.toBeInTheDocument();
	});

	it('renders without tech badge when technologies array is empty', () => {
		const project: Project = {
			...mockProject,
			technologies: [],
		};
		render(<ProjectCard project={project} />);
		expect(screen.queryByLabelText('React')).not.toBeInTheDocument();
	});

	describe('with onViewProject', () => {
		it('renders a button instead of a link', () => {
			const onViewProject = jest.fn();
			render(<ProjectCard project={mockProject} onViewProject={onViewProject} />);
			expect(screen.getByRole('button', { name: /view project/i })).toBeInTheDocument();
			expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument();
		});

		it('calls onViewProject with the project when the button is clicked', () => {
			const onViewProject = jest.fn();
			render(<ProjectCard project={mockProject} onViewProject={onViewProject} />);
			fireEvent.click(screen.getByRole('button', { name: /view project/i }));
			expect(onViewProject).toHaveBeenCalledWith(mockProject);
		});

		it('calls onViewProject exactly once per click', () => {
			const onViewProject = jest.fn();
			render(<ProjectCard project={mockProject} onViewProject={onViewProject} />);
			fireEvent.click(screen.getByRole('button', { name: /view project/i }));
			expect(onViewProject).toHaveBeenCalledTimes(1);
		});
	});
});
