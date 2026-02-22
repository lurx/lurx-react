import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../project-card.component';
import type { Project } from '../../../data/projects.data';

const mockProject: Project = {
	id: 1,
	number: 1,
	slug: '_ui-animations',
	description: 'A test project description.',
	technologies: ['React', 'TypeScript'],
	liveUrl: 'https://example.com',
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

	it('renders the view-project button', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByText('view-project')).toBeInTheDocument();
	});

	it('links the view button to the live url', () => {
		render(<ProjectCard project={mockProject} />);
		const link = screen.getByRole('link', { name: /view project/i });
		expect(link).toHaveAttribute('href', 'https://example.com');
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
		// Should still render the card
		expect(screen.getByText('view-project')).toBeInTheDocument();
	});

	it('falls back to # when liveUrl is undefined', () => {
		const project: Project = {
			...mockProject,
			liveUrl: undefined,
		};
		render(<ProjectCard project={project} />);
		const link = screen.getByRole('link', { name: /view project/i });
		expect(link).toHaveAttribute('href', '#');
	});

	it('renders without tech badge when technologies array is empty', () => {
		const project: Project = {
			...mockProject,
			technologies: [],
		};
		render(<ProjectCard project={project} />);
		expect(screen.queryByLabelText('React')).not.toBeInTheDocument();
	});
});
