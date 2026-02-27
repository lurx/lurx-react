export type SocialLink = {
	url: string;
	label: string;
	displayText?: string;
	hideLabel?: boolean;
	icon: IconData;
};

export type SocialLinks = Record<string, SocialLink>;
