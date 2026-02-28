export type CvContextValue = {
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
};
