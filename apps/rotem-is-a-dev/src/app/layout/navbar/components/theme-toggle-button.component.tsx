'use client';

import { FaIcon } from '@/app/components';
import { THEME_TOGGLE_ICONS, THEME_TOGGLE_LABELS, useThemeContext } from '../../theme';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

export const ThemeToggleButton = () => {
	const { resolvedTheme, toggleTheme } = useThemeContext();

	return (
		<NavItem
			label={THEME_TOGGLE_LABELS[resolvedTheme]}
			iconOnly
			icon={
				<FaIcon
					iconName={THEME_TOGGLE_ICONS[resolvedTheme]}
					iconGroup="fal"
				/>
			}
			onClick={toggleTheme}
			className={styles.themeToggle}
			active={false}
		/>
	);
};
