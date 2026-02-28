import { toCodeLike } from '@/app/utils/to-code-like.util';
import classNames from 'classnames';
import styles from './mobile-menu.module.scss';
import type { MobileNavItemProps } from './mobile-nav-item.types';

export const MobileNavItem = ({ label, href, pathname }: MobileNavItemProps) => {
	const isActive = pathname === href;

	return (
		<li>
			<a
				href={href}
				className={classNames(styles.navLink, {
					[styles.active]: isActive,
				})}
				aria-current={isActive ? 'page' : undefined}
				role="menuitem"
			>
				{toCodeLike(label, { prefix: '_', convertCase: 'kebab-case' })}
			</a>
		</li>
	);
};
