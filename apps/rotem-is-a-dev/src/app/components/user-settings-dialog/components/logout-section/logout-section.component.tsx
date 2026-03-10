import { FaIcon } from '@/app/components';
import { USER_SETTINGS_STRINGS } from '../../user-settings-dialog.constants';
import styles from './logout-section.module.scss';
import type { LogoutSectionProps } from './logout-section.types';

export const LogoutSection = ({ onSignOut }: LogoutSectionProps) => {
	return (
		<button
			type="button"
			className={styles.signOutButton}
			onClick={onSignOut}
		>
			<FaIcon iconName="right-from-bracket" iconGroup="fal" size="sm" />
			{USER_SETTINGS_STRINGS.SIGN_OUT}
		</button>
	);
};
