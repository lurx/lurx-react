import type { ContactChannel } from './contact-info.types';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';

export const CONTACT_CHANNELS = [
	{
		id: 'github',
		label: 'github',
		value: 'github.com/lurx',
		href: 'https://github.com/lurx',
		iconName: 'github',
		external: true,
	},
	{
		id: 'linkedin',
		label: 'linkedin',
		value: 'linkedin.com/in/rotem-horovitz',
		href: 'https://linkedin.com/in/rotem-horovitz',
		iconName: 'linkedin',
		external: true,
	},
	{
		id: 'email',
		label: 'email',
		value: CONTACT_EMAIL,
		href: `mailto:${CONTACT_EMAIL}`,
		iconName: 'envelope',
	},
] as const satisfies readonly ContactChannel[];
