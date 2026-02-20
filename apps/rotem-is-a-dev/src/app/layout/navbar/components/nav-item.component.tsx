import classNames from 'classnames';
import styles from '../navbar.module.scss';

interface NavItemProps {
	label: string;
	href: string;
	active: boolean;
	enabled?: boolean;
}

export const NavItem = ({
	label,
	href,
	active,
	enabled = true,
}: NavItemProps) => {
	const ariaCurrentValue = active ? 'page' : undefined;
	if (!enabled) {
		return null;
	}
	return (
		<a
			key={label}
			href={href}
			className={classNames(styles.navItem, { [styles.active]: active })}
			aria-current={ariaCurrentValue}
		>
			{label}
		</a>
	);
};
