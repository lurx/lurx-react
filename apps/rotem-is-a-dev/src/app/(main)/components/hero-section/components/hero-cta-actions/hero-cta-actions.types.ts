export type CtaVariant = 'primary' | 'secondary';

export type CtaAction = {
	id: string;
	label: string;
	href: string;
	variant: CtaVariant;
};
