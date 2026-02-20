import type { IconGroupName } from '@/app/cv/types';

export type SocialLink = {
	url: string;
	label: string;
	displayText?: string;
	hideLabel?: boolean;
	icon: {
		iconName: string;
		iconGroup: IconGroupName;
	};
};

export type SocialLinks = Record<string, SocialLink>;
