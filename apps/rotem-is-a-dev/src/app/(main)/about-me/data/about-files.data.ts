import cv from '@/data/cv.data';
import brickfallInstructions from './brickfall-instructions.md?raw';
import snakeInstructions from './snake-instructions.md?raw';
import type {
	AboutFileContent,
	AboutFileId,
	SectionConfig,
	SectionId,
} from './about-files.types';

export type { AboutFileContent, AboutFileId, JsdocFileContent, JsonFileContent, MarkdownFileContent, SectionConfig, SectionId } from './about-files.types';

export const SECTIONS: SectionConfig[] = [
	{ id: 'personal-info', label: 'Personal info', icon: 'user' },
	{ id: 'work-experience', label: 'Work experience', icon: 'briefcase' },
	{ id: 'gaming', label: 'Gaming', icon: 'alien-8bit' },
];

export const SECTION_FILES: Record<SectionId, AboutFileId[]> = {
	'personal-info': ['bio', 'interests'],
	'work-experience': ['payoneer', 'startup-booster', 'investing-com', 'isocia'],
	'gaming': ['snake-game', 'brickfall-game'],
};

export const ABOUT_FILES: Record<AboutFileId, AboutFileContent> = {
	bio: {
		title: 'bio',
		format: 'jsdoc',
		paragraphs: [
			'I\u2019m Rotem, a Senior Frontend Developer and CSS Expert with over 16 years of experience building for the web. My journey began with hand-coding landing pages and has evolved into architecting robust design systems and frontend infrastructures for global platforms.',
			'I pride myself on being entirely self-taught, driven by a stubborn refusal to ship anything less than pixel-perfect. Whether I\u2019m mentoring developers, interviewing new talent, or defining the next frontend stack, my goal is always the same: creating scalable, high-quality user experiences that last.',
		],
	},
	interests: {
		title: 'interests',
		format: 'jsdoc',
		paragraphs: [
			'When I\u2019m not writing code, you\u2019ll find me exploring new frontend frameworks, diving into CSS art challenges, or contributing to open-source projects.',
			'I\u2019m passionate about design systems, developer tooling, and the intersection of design and engineering. I also enjoy mentoring aspiring developers and sharing knowledge through community talks.',
		],
	},
	payoneer: {
		title: 'payoneer',
		format: 'json',
		json: cv.work_experience[0] as unknown as Record<string, unknown>,
	},
	'startup-booster': {
		title: 'startup-booster',
		format: 'json',
		json: cv.work_experience[1] as unknown as Record<string, unknown>,
	},
	'investing-com': {
		title: 'investing-com',
		format: 'json',
		json: cv.work_experience[2] as unknown as Record<string, unknown>,
	},
	isocia: {
		title: 'isocia',
		format: 'json',
		json: cv.work_experience[3] as unknown as Record<string, unknown>,
	},
	'snake-game': {
		title: 'snake-game',
		format: 'markdown',
		raw: snakeInstructions,
	},
	'brickfall-game': {
		title: 'brickfall-game',
		format: 'markdown',
		raw: brickfallInstructions,
	},
};

export const DEFAULT_FILE_ID: AboutFileId = 'bio';

export const getFileSection = (fileId: AboutFileId): Nullable<SectionId> => {
	for (const [sectionId, fileIds] of Object.entries(SECTION_FILES)) {
		if (fileIds.includes(fileId)) return sectionId as SectionId;
	}
	return null;
};
