interface ExperienceItem {
	company: string;
	position: string;
	duration: {
		start: number;
		end: number | 'Present';
	};
	description?: string;
	achievements?: string[];
}

interface CvContextValue {
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

interface SkillObject extends IconData {
	name: string;
	level: number;
}
