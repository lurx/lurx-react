import { toCodeLike } from '@/app/utils/to-code-like.util';
import classNames from 'classnames';
import { isString } from 'es-toolkit';
import styles from '../navbar.module.scss';
import type { NavItemProps } from '../navbar.types';

export const NavItem = ({
	label,
	href,
	active,
	icon,
	iconOnly = false,
	enabled = true,
	className,
	...dataAttributes
}: NavItemProps) => {
	const ariaCurrentValue = active ? 'page' : undefined;
	const hasIcon = Boolean(icon);
	const hideLabel = iconOnly && hasIcon;
	const ariaLabel = hideLabel && isString(label) ? label : undefined;

	const formattedLabel = isString(label)
		? toCodeLike(label, { prefix: '_', convertCase: 'kebab-case' })
		: label;

	if (!enabled) {
		return null;
	}
	return (
		<a
			key={label?.toString()}
			href={href}
			className={classNames(styles.navItem, { [styles.active]: active }, className)}
			aria-current={ariaCurrentValue}
			aria-label={ariaLabel}
		>
			{icon}
			{!hideLabel && (
				<span {...dataAttributes}>{formattedLabel}</span>
			)}
		</a>
	);
};
