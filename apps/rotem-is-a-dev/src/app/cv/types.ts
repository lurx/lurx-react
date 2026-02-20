export interface ExperienceItem {
	company: string;
	position: string;
	duration: {
		start: number;
		end: number | 'Present';
	};
	description?: string;
	achievements?: string[];
}

export interface CvContextValue {
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

export interface SkillObject {
	name: string;
	icon?: string;
	iconGroup?: IconGroupName;
	level: number;
}

export type IconGroupName =
	| 'fab' // brands
  | "fal" // light
  | 'far' // regular
	| 'fas' // solid
  | 'fass'; // sharp solid

