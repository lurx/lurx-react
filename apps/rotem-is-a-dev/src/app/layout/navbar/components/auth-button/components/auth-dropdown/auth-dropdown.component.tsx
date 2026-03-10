import { FaIcon } from '@/app/components';
import { AUTH_BUTTON_STRINGS } from '../../auth-button.constants';
import styles from '../../auth-button.module.scss';
import type { AuthDropdownProps } from './auth-dropdown.types';

export const AuthDropdown = ({
	isOpen,
	openSettings,
	onSignOut,
}: AuthDropdownProps) => {
	if (!isOpen) return null;

	return (
		<div
			className={styles.dropdown}
			role="menu"
		>
			<button
				type="button"
				className={styles.menuItem}
				onClick={openSettings}
				role="menuitem"
			>
				<FaIcon
					iconName="gear"
					iconGroup="fal"
					size="sm"
				/>
				{AUTH_BUTTON_STRINGS.SETTINGS}
			</button>
			<button
				type="button"
				className={styles.menuItem}
				onClick={onSignOut}
				role="menuitem"
			>
				<FaIcon
					iconName="right-from-bracket"
					iconGroup="fal"
					size="sm"
				/>
				{AUTH_BUTTON_STRINGS.SIGN_OUT}
			</button>
		</div>
	);
};
