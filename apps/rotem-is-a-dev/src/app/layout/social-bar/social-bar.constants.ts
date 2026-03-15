import type { SocialLinks } from './social-bar.types';

const TWITTER_URL = 'https://x.com/lurx';
const LINKEDIN_URL = 'https://linkedin.com/in/rotem-horovitz';
const GITHUB_URL = 'https://github.com/lurx';

export const leftSideSocialLinks: SocialLinks = {
  github: {
		url: GITHUB_URL,
		label: 'GitHub',
		displayText: '@lurx',
    hideLabel: true,
		icon: {
			iconName: 'github-alt',
			iconGroup: 'fab',
		},
	},
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
			iconName: 'linkedin-in',
			iconGroup: 'fab',
		},
	},
};
