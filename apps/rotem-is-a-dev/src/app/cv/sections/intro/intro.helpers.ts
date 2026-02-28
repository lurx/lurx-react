export const calculateYearsOfExperience = (
	workExperience: ExperienceItem[],
): number => {
	const earliestYear = Math.min(
		...workExperience.map(exp => exp.duration.start),
	);
	return new Date().getFullYear() - earliestYear;
};
