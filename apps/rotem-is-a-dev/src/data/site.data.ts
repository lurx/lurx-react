/**
 * Single source of truth for the site's public identity.
 *
 * The live domain previously appeared in several files independently, which
 * let them drift apart. Import from here instead of writing the URL again.
 */
export const SITE_URL = 'https://rotemhorovitz.com';

export const SITE_NAME = 'Rotem Horovitz';

export const AUTHOR = {
	name: 'Rotem Horovitz',
	url: SITE_URL,
	sameAs: [
		'https://linkedin.com/in/rotem-horovitz',
		'https://github.com/lurx',
	],
} as const;
