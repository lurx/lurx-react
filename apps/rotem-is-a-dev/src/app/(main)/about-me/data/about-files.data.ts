export type AboutFileId = 'bio' | 'interests';

export interface AboutFileContent {
	title: string;
	paragraphs: string[];
}

export const ABOUT_FILES: Record<AboutFileId, AboutFileContent> = {
	bio: {
		title: 'bio',
		paragraphs: [
			'I\u2019m Rotem, a Senior Frontend Developer and CSS Expert with over 16 years of experience building for the web. My journey began with hand-coding landing pages and has evolved into architecting robust design systems and frontend infrastructures for global platforms.',
			'I pride myself on being entirely self-taught, driven by a stubborn refusal to ship anything less than pixel-perfect. Whether I\u2019m mentoring developers, interviewing new talent, or defining the next frontend stack, my goal is always the same: creating scalable, high-quality user experiences that last.',
		],
	},
	interests: {
		title: 'interests',
		paragraphs: [
			'When I\u2019m not writing code, you\u2019ll find me exploring new frontend frameworks, diving into CSS art challenges, or contributing to open-source projects.',
			'I\u2019m passionate about design systems, developer tooling, and the intersection of design and engineering. I also enjoy mentoring aspiring developers and sharing knowledge through community talks.',
		],
	},
};

export const DEFAULT_FILE_ID: AboutFileId = 'bio';
