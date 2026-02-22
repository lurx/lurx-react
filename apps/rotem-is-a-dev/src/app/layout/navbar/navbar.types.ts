import type { ReactNode } from 'react';

export type NavItemProps = WithDataAttributes<{
	label: ReactNode;
	href: string;
	active: boolean;
	enabled?: boolean;
	icon?: ReactNode;
	iconOnly?: boolean;
	className?: string;
}>;
