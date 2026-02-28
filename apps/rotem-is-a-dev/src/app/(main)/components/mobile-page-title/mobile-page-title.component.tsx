'use client';

import { useResponsive } from '@/hooks';
import styles from './mobile-page-title.module.scss';

type MobilePageTitleProps = {
	title: string;
}

export const MobilePageTitle = ({ title }: MobilePageTitleProps) => {
	const { isMobile } = useResponsive();

	if (!isMobile) return null;

	return <h2 className={styles.title}>{title}</h2>;
};
