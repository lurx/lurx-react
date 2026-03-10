import { FaIcon, UserAvatar } from '@/app/components';
import { USER_SETTINGS_STRINGS } from '../../user-settings-dialog.constants';
import styles from './general-section.module.scss';
import type { GeneralSectionProps } from './general-section.types';

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
	google: 'Google',
	github: 'GitHub',
};

export const GeneralSection = ({ user }: GeneralSectionProps) => {
	const providerDisplayName = PROVIDER_DISPLAY_NAMES[user.provider] ?? user.provider;

	return (
		<div className={styles.general}>
			<UserAvatar
				photoURL={user.photoURL}
				displayName={user.displayName}
				provider={user.provider}
				size={64}
			/>
			<div className={styles.info}>
				<span className={styles.displayName}>{user.displayName}</span>
				<span className={styles.email}>{user.email}</span>
				<span className={styles.provider}>
					<FaIcon iconName={user.provider} iconGroup="fab" size="xs" />
					{USER_SETTINGS_STRINGS.SIGNED_IN_WITH} {providerDisplayName}
				</span>
			</div>
		</div>
	);
};
