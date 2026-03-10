import { UserAvatar } from '@/app/components';
import { useAuth } from '@/app/context/auth';
import { AUTH_BUTTON_STRINGS } from '../../auth-button.constants';
import styles from '../../auth-button.module.scss';
import type { AuthAvatarProps } from './auth-avatar.types';

export const AuthAvatar = ({ isDropdownOpen, onClick }: AuthAvatarProps) => {
	const { user } = useAuth();

	if (!user) return null;

	return (
		<button
			type="button"
			className={styles.avatarButton}
			aria-expanded={Boolean(isDropdownOpen)}
			onClick={onClick}
			aria-label={AUTH_BUTTON_STRINGS.DROPDOWN_LABEL}
		>
			<UserAvatar
				photoURL={user.photoURL}
				displayName={user.displayName}
				provider={user.provider}
			/>
		</button>
	);
};
