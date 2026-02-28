'use client';

import { useResponsive } from '@/hooks';
import styles from './mobile-page-title.module.scss';
import type { MobilePageTitleProps } from './mobile-page-title.types';

export const MobilePageTitle = ({ title }: MobilePageTitleProps) => {
	const { isMobile } = useResponsive();

	if (!isMobile) return null;

	return <h2 className={styles.title}>{title}</h2>;
};
