import { fireEvent, render, screen } from '@testing-library/react';
import type { Project } from '../../../data/projects.data';

jest.mock('@/app/components', () => ({
	FilterPanel: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="filter-panel">{children}</div>
	),
	TextInput: ({
		label,
		value,
		onChange,
		placeholder,
	}: {
		label: string;
		value: string;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		placeholder?: string;
	}) => (
		<input
			aria-label={label}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			data-testid="text-input"
		/>
	),
	TechnologyFilter: ({
		technologies,
		selected,
		onToggleAction,
	}: {
		technologies: string[];
		selected: string[];
		onToggleAction: (tech: string) => void;
	}) => (
		<div data-testid="technology-filter">
			{technologies.map(tech => (
				<button
					key={tech}
					onClick={() => onToggleAction(tech)}
					data-selected={selected.includes(tech)}
				>
					{tech}
				</button>
			))}
		</div>
	),
}));

jest.mock('../../projects-grid', () => ({
	ProjectsGrid: ({
		projects,
		onViewProjectAction,
		onCommentClickAction,
	}: {
		projects: Project[];
		onViewProjectAction?: (project: Project) => void;
		onCommentClickAction?: (project: Project) => void;
	}) => (
		<div data-testid="projects-grid">
			{projects.map(project => (
				<div key={project.id} data-testid={`project-${project.id}`}>
					<span>{project.slug}</span>
					{onViewProjectAction && (
						<button onClick={() => onViewProjectAction(project)}>view {project.slug}</button>
					)}
					{onCommentClickAction && (
						<button onClick={() => onCommentClickAction(project)}>comment {project.slug}</button>
					)}
				</div>
			))}
		</div>
	),
}));

jest.mock('../../demo-renderer', () => ({
	DemoRenderer: ({ demo }: { demo: React.ComponentType | null }) =>
		demo ? <div data-testid="demo-renderer" /> : null,
}));

jest.mock('../../project-demo-drawer', () => ({
	ProjectDemoDrawer: ({
		project,
		onCloseAction,
		scrollToComments,
		children,
	}: {
		project: Project | null;
		onCloseAction: () => void;
		scrollToComments?: boolean;
		children: React.ReactNode;
	}) =>
		project ? (
			<div data-testid="project-demo-drawer" data-scroll-to-comments={scrollToComments}>
				<button onClick={onCloseAction}>close</button>
				{children}
			</div>
		) : null,
}));

jest.mock('@/app/utils/toggle-in-array.util', () => ({
	toggleInArray: <T,>(arr: T[], item: T): T[] =>
		arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item],
}));

import { ProjectsPage } from '../projects-page.component';

describe('ProjectsPage', () => {
	it('renders the filter panel', () => {
		render(<ProjectsPage />);
		expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
	});

	it('renders the text input for search', () => {
		render(<ProjectsPage />);
		expect(screen.getByTestId('text-input')).toBeInTheDocument();
	});

	it('renders the technology filter', () => {
		render(<ProjectsPage />);
		expect(screen.getByTestId('technology-filter')).toBeInTheDocument();
	});

	it('renders the projects grid', () => {
		render(<ProjectsPage />);
		expect(screen.getByTestId('projects-grid')).toBeInTheDocument();
	});

	it('renders all projects initially (no filters)', () => {
		render(<ProjectsPage />);
		// All 3 PROJECTS from data should appear in the grid
		expect(screen.getByText('_wolverine-css')).toBeInTheDocument();
		expect(screen.getByText('_sheep-css')).toBeInTheDocument();
		expect(screen.getByText('_animated-logo-loader')).toBeInTheDocument();
	});

	it('filters projects by search text', () => {
		render(<ProjectsPage />);
		const input = screen.getByTestId('text-input');
		fireEvent.change(input, { target: { value: 'wolverine' } });
		expect(screen.getByText('_wolverine-css')).toBeInTheDocument();
		expect(screen.queryByText('_sheep-css')).not.toBeInTheDocument();
	});

	it('filters projects by technology toggle', () => {
		render(<ProjectsPage />);
		// 'svg' is only in _animated-logo-loader
		fireEvent.click(screen.getByRole('button', { name: 'svg' }));
		expect(screen.getByText('_animated-logo-loader')).toBeInTheDocument();
		expect(screen.queryByText('_wolverine-css')).not.toBeInTheDocument();
		expect(screen.queryByText('_sheep-css')).not.toBeInTheDocument();
	});

	it('clears technology filter when same technology is toggled again', () => {
		render(<ProjectsPage />);
		fireEvent.click(screen.getByRole('button', { name: 'svg' }));
		fireEvent.click(screen.getByRole('button', { name: 'svg' }));
		expect(screen.getByText('_wolverine-css')).toBeInTheDocument();
		expect(screen.getByText('_sheep-css')).toBeInTheDocument();
		expect(screen.getByText('_animated-logo-loader')).toBeInTheDocument();
	});

	it('does not render the demo drawer initially', () => {
		render(<ProjectsPage />);
		expect(screen.queryByTestId('project-demo-drawer')).not.toBeInTheDocument();
	});

	it('opens the demo drawer when a project is selected', () => {
		render(<ProjectsPage />);
		fireEvent.click(screen.getByRole('button', { name: 'view _wolverine-css' }));
		expect(screen.getByTestId('project-demo-drawer')).toBeInTheDocument();
	});

	it('closes the demo drawer when close is clicked', () => {
		render(<ProjectsPage />);
		fireEvent.click(screen.getByRole('button', { name: 'view _wolverine-css' }));
		expect(screen.getByTestId('project-demo-drawer')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'close' }));
		expect(screen.queryByTestId('project-demo-drawer')).not.toBeInTheDocument();
	});

	it('shows the empty search query result when search matches nothing', () => {
		render(<ProjectsPage />);
		const input = screen.getByTestId('text-input');
		fireEvent.change(input, { target: { value: 'xyznotaproject' } });
		expect(screen.queryByText('_wolverine-css')).not.toBeInTheDocument();
		expect(screen.queryByText('_sheep-css')).not.toBeInTheDocument();
		expect(screen.queryByText('_animated-logo-loader')).not.toBeInTheDocument();
	});

	it('opens the demo drawer with scrollToComments when comment button is clicked', () => {
		render(<ProjectsPage />);
		fireEvent.click(screen.getByRole('button', { name: 'comment _wolverine-css' }));
		expect(screen.getByTestId('project-demo-drawer')).toBeInTheDocument();
		expect(screen.getByTestId('project-demo-drawer')).toHaveAttribute('data-scroll-to-comments', 'true');
	});

	it('sets scrollToComments to false when view button is clicked', () => {
		render(<ProjectsPage />);
		fireEvent.click(screen.getByRole('button', { name: 'view _wolverine-css' }));
		expect(screen.getByTestId('project-demo-drawer')).toHaveAttribute('data-scroll-to-comments', 'false');
	});
});
