export const sortByEndDate = (jobs: ExperienceItem[]): ExperienceItem[] => {
	return [...jobs].sort((jobA, jobB) => {
		if (jobA.duration.end === 'Present') return -1;
		if (jobB.duration.end === 'Present') return 1;
		return jobB.duration.end - jobA.duration.end;
	});
};
