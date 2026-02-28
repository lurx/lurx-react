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
		onToggle,
	}: {
		technologies: string[];
		selected: string[];
		onToggle: (tech: string) => void;
	}) => (
		<div data-testid="technology-filter">
			{technologies.map(tech => (
				<button
					key={tech}
					onClick={() => onToggle(tech)}
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
		onViewProject,
	}: {
		projects: Project[];
		onViewProject?: (project: Project) => void;
	}) => (
		<div data-testid="projects-grid">
			{projects.map(p => (
				<div key={p.id} data-testid={`project-${p.id}`}>
					<span>{p.slug}</span>
					{onViewProject && (
						<button onClick={() => onViewProject(p)}>view {p.slug}</button>
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
		onClose,
		children,
	}: {
		project: Project | null;
		onClose: () => void;
		children: React.ReactNode;
	}) =>
		project ? (
			<div data-testid="project-demo-drawer">
				<button onClick={onClose}>close</button>
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
});
