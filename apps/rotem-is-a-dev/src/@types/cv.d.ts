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

type CvContextValue = {
	name: string;
	titles: string[];
	intro: string;
	contact: {
		email: string;
		phone: string;
		social: {
			linkedin: string;
			github: string;
		};
	};
	work_experience: ExperienceItem[];
	skills: SkillObject[];
	languages: string[];
}

type SkillObject = IconData & {
	name: string;
	level: number;
}
