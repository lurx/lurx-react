type ExperienceItem = {
	company: string;
	position: string;
	duration: {
		start: number;
		end: number | 'Present';
	};
	description?: string;
	achievements?: string[];
}

type SkillObject = IconData & {
	name: string;
	level: number;
}
