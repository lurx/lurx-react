'use client';

import { Nav } from '@/app/sections';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { DownloadPdfButton } from '../download-pdf-button/download-pdf-button.component';
import { Flex } from '../flex';
import { ThemeToggle } from '../theme-toggle/theme-toggle.component';
import styles from './app-header.module.scss';

export const AppHeader = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 0);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<Flex
			tag="header"
			justify="center"
			gap="medium"
			className={classnames(styles.appHeader, { [styles.scrolled]: isScrolled })}
		>
			<Nav />
			<DownloadPdfButton />
			<ThemeToggle />
		</Flex>
	);
};
