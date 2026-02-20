import classNames from 'classnames';
import { isString } from 'es-toolkit';
import styles from '../navbar.module.scss';
import type { NavItemProps } from '../navbar.types';
import { toCodeLike } from '@/app/utils/to-code-like.util';

export const NavItem = ({
	label,
	href,
	active,
	icon,
	iconOnly = false,
	enabled = true,
}: NavItemProps) => {
	const ariaCurrentValue = active ? 'page' : undefined;
	const hasIcon = Boolean(icon);
	const hideLabel = iconOnly && hasIcon;
	const ariaLabel = hideLabel && isString(label) ? label : undefined;

	const formattedLabel = isString(label)
		? toCodeLike(label, { prefix: '_', convertCase: 'snake_case' })
		: label;

    if (!enabled) {
		return null;
	}
	return (
		<a
			key={label?.toString()}
			href={href}
			className={classNames(styles.navItem, { [styles.active]: active })}
			aria-current={ariaCurrentValue}
			aria-label={ariaLabel}
		>
			{icon}
			{!hideLabel && formattedLabel}
		</a>
	);
};
