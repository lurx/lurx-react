import type { JSX } from 'react';
import type { SocialLink as SocialLinkData } from '../social-bar.types';

export type SocialLinkProps = {
	link: SocialLinkData;
	iconPosition?: 'start' | 'end' | 'hide';
}

export type RenderItem = {
	key: string;
	element: Optional<JSX.Element>;
}
