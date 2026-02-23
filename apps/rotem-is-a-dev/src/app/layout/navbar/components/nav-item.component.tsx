import { toCodeLike } from '@/app/utils/to-code-like.util';
import classNames from 'classnames';
import { isString } from 'es-toolkit';
import styles from '../navbar.module.scss';
import type { NavItemProps } from '../navbar.types';

export const NavItem = ({
	label,
	href,
	onClick,
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

	const itemClassName = classNames(styles.navItem, { [styles.active]: active }, className);
	const children = (
		<>
			{icon}
			{!hideLabel && (
				<span {...dataAttributes}>{formattedLabel}</span>
			)}
		</>
	);

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className={itemClassName}
				aria-current={ariaCurrentValue}
				aria-label={ariaLabel}
			>
				{children}
			</button>
		);
	}

	return (
		<a
			key={label?.toString()}
			href={href}
			className={itemClassName}
			aria-current={ariaCurrentValue}
			aria-label={ariaLabel}
		>
			{children}
		</a>
	);
};
