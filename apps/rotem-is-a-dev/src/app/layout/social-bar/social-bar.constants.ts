import type { SocialLinks } from './social-bar.types';

const TWITTER_URL = 'https://x.com/lurxie';
const LINKEDIN_URL = 'https://linkedin.com/in/rotem-lurx-horovitz-9601705';
const GITHUB_URL = 'https://github.com/lurx';

export const leftSideSocialLinks: SocialLinks = {
	twitter: {
		url: TWITTER_URL,
		label: 'X (Twitter)',
    hideLabel: true,
		icon: {
			iconName: 'x-twitter',
			iconGroup: 'fab',
		},
	},
	linkedin: {
		url: LINKEDIN_URL,
		label: 'LinkedIn',
    hideLabel: true,
		icon: {
			iconName: 'linkedin',
			iconGroup: 'fab',
		},
	},
};

export const rightSideSocialLinks: SocialLinks = {
	github: {
		url: GITHUB_URL,
		label: 'GitHub',
		displayText: '@lurx',
		icon: {
			iconName: 'square-github',
			iconGroup: 'fab',
		},
	},
};
