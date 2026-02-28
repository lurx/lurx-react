import { FaIcon } from '@/app/components';
import styles from './sidebar-button.module.scss';
import type { SideBarButtonProps } from './sidebar-button.types';

export const SideBarButton = ({
	ariaLabel,
	iconName,
	isActive,
	onClick,
}: SideBarButtonProps) => {
	return (
		<button
			className={`${styles.sidebarIcon} ${isActive ? styles.activeIcon : ''}`}
			aria-label={ariaLabel}
			aria-pressed={isActive}
			type="button"
			onClick={onClick}
		>
			<FaIcon
				iconName={iconName}
				iconGroup="fal"
			/>
		</button>
	);
};
