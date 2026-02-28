import { filterProjects } from '../projects-page.helpers';

type MockProject = {
	slug: string;
	description: string;
	technologies: string[];
};

const makeProject = (overrides: Partial<MockProject> = {}): MockProject => ({
	slug: 'default-project',
	description: 'Default description',
	technologies: [],
	...overrides,
});

describe('filterProjects', () => {
	// 'html' and 'svg' are intentionally absent so we can test a no-match technology filter
	const projects = [
		makeProject({ slug: 'my-portfolio', description: 'A React portfolio site', technologies: ['react', 'typescript', 'scss'] }),
		makeProject({ slug: 'css-gallery', description: 'A gallery of CSS experiments', technologies: ['css', 'scss'] }),
		makeProject({ slug: 'ts-utils', description: 'TypeScript utility functions', technologies: ['typescript'] }),
	] as never[];

	describe('technology filtering', () => {
		it('returns all projects when no technologies are selected', () => {
			expect(filterProjects(projects, [], '')).toHaveLength(3);
		});

		it('returns projects that include a selected technology', () => {
			const result = filterProjects(projects, ['react'], '');
			expect(result).toHaveLength(1);
			expect(result[0].slug).toBe('my-portfolio');
		});

		it('returns projects matching any of the selected technologies', () => {
			const result = filterProjects(projects, ['react', 'css'], '');
			expect(result).toHaveLength(2);
		});

		it('returns projects matching a shared technology across multiple entries', () => {
			const result = filterProjects(projects, ['typescript'], '');
			expect(result).toHaveLength(2);
		});

		it('returns an empty array when no projects use the selected technology', () => {
			const result = filterProjects(projects, ['svg'], '');
			expect(result).toHaveLength(0);
		});
	});

	describe('search filtering', () => {
		it('returns all projects when search is empty', () => {
			expect(filterProjects(projects, [], '')).toHaveLength(3);
		});

		it('filters by slug (case-insensitive)', () => {
			const result = filterProjects(projects, [], 'PORTFOLIO');
			expect(result).toHaveLength(1);
			expect(result[0].slug).toBe('my-portfolio');
		});

		it('filters by description (case-insensitive)', () => {
			const result = filterProjects(projects, [], 'gallery');
			expect(result).toHaveLength(1);
			expect(result[0].slug).toBe('css-gallery');
		});

		it('returns an empty array when search matches nothing', () => {
			expect(filterProjects(projects, [], 'nonexistent')).toHaveLength(0);
		});
	});

	describe('combined technology and search filtering', () => {
		it('applies both technology and search filters simultaneously', () => {
			const result = filterProjects(projects, ['typescript'], 'utils');
			expect(result).toHaveLength(1);
			expect(result[0].slug).toBe('ts-utils');
		});

		it('returns empty when technology matches but search does not', () => {
			expect(filterProjects(projects, ['react'], 'css')).toHaveLength(0);
		});

		it('returns empty when search matches but technology does not', () => {
			expect(filterProjects(projects, ['css'], 'portfolio')).toHaveLength(0);
		});
	});
});
