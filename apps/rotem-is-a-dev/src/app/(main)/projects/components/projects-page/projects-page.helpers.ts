import type { Project } from '../../data/projects.data';

export const filterProjects = (
	projects: Project[],
	selectedTechnologies: Technology[],
	search: string,
): Project[] => {
	const searchLower = search.toLowerCase();

	return projects.filter(project => {
		const matchesTech =
			selectedTechnologies.length === 0 ||
			project.technologies.some(tech =>
				selectedTechnologies.includes(tech),
			);
		const matchesSearch =
			!search ||
			project.slug.toLowerCase().includes(searchLower) ||
			project.description.toLowerCase().includes(searchLower);
		return matchesTech && matchesSearch;
	});
};
