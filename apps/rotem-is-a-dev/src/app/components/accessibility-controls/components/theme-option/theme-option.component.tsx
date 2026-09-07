'use client';

import classNames from 'classnames';
import { useCallback } from 'react';
import styles from './theme-option.module.scss';
import type { ThemeOptionProps } from './theme-option.types';

export const ThemeOption = ({
	theme,
	label,
	isActive,
	onSelectAction,
}: ThemeOptionProps) => {
	const handleClick = useCallback(() => {
		onSelectAction(theme);
	}, [onSelectAction, theme]);

	return (
		<button
			className={classNames(styles.option, {
				[styles.optionActive]: isActive,
			})}
			onClick={handleClick}
			aria-pressed={isActive}
		>
			{label}
		</button>
	);
};
