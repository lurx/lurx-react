import type { CtaAction } from './hero-cta-actions.types';

export const CTA_ACTIONS = [
	{
		id: 'view-projects',
		label: './view-projects',
		href: '/projects',
		variant: 'primary',
	},
	{
		id: 'contact-me',
		label: './contact-me',
		href: '/contact',
		variant: 'secondary',
	},
] as const satisfies readonly CtaAction[];
