import { calculateYearsOfExperience } from '@/app/cv/sections/intro/intro.helpers';

export const resolveIntroText = (
	template: string,
	workExperience: ExperienceItem[],
): string => {
	const years = calculateYearsOfExperience(workExperience);
	return template.replace('%numYears%', String(years));
};

export const formatDuration = (duration: ExperienceItem['duration']): string => {
	const end = duration.end === 'Present' ? 'Present' : String(duration.end);
	return `${duration.start} - ${end}`;
};
