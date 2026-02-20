import type { ReactNode } from 'react';

export interface NavItemProps {
	label: ReactNode;
	href: string;
	active: boolean;
	enabled?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
}
