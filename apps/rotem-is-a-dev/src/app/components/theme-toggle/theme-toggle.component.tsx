'use client';

import { Button } from '@/app/components/button/button.component';
import { FaIcon } from '@/app/components/fa-icon/fa-icon.component';
import { useTheme } from '@/app/context/theme.context';
import styles from './theme-toggle.module.scss';

export const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className={styles.toggle}>
			<Button variant="ghost" onClick={toggleTheme}>
				<FaIcon iconName={theme === 'dark' ? 'sun-bright' : 'moon'} />
			</Button>
		</div>
	);
};
