import { useAuth } from '@/app/context/auth';
import { useCallback } from 'react';
import { Dialog } from '../dialog';
import {
	AccessibilitySection,
	DangerZoneSection,
	GeneralSection,
	LogoutSection,
} from './components';
import { USER_SETTINGS_STRINGS } from './user-settings-dialog.constants';
import styles from './user-settings-dialog.module.scss';
import type { UserSettingsDialogProps } from './user-settings-dialog.types';

export const UserSettingsDialog = ({ isOpen, onCloseAction }: UserSettingsDialogProps) => {
	const { signOut, deleteUser } = useAuth();

	const handleSignOut = useCallback(async () => {
		await signOut();
		onCloseAction();
	}, [signOut, onCloseAction]);

	const handleDeleteAccount = useCallback(async () => {
		await deleteUser();
		onCloseAction();
	}, [deleteUser, onCloseAction]);

	return (
		<Dialog
			isOpen={isOpen}
			onCloseAction={onCloseAction}
			ariaLabel={USER_SETTINGS_STRINGS.DIALOG_LABEL}
			className={styles.settingsDialog}
		>
			<span className={styles.title}>{USER_SETTINGS_STRINGS.TITLE}</span>
			<div className={styles.section}>
				<span className={styles.sectionTitle}>{USER_SETTINGS_STRINGS.GENERAL_TITLE}</span>
				<GeneralSection />
			</div>
			<div className={styles.divider} />
			<div className={styles.section}>
				<span className={styles.sectionTitle}>{USER_SETTINGS_STRINGS.ACCESSIBILITY_TITLE}</span>
				<AccessibilitySection />
			</div>
			<div className={styles.divider} />
			<div className={styles.section}>
				<span className={styles.sectionTitle} data-name="danger-zone">{USER_SETTINGS_STRINGS.DANGER_ZONE_TITLE}</span>
				<DangerZoneSection onDeleteAccountAction={handleDeleteAccount} />
			</div>
			<div className={styles.divider} />
			<div className={styles.section}>
				<span className={styles.sectionTitle}>{USER_SETTINGS_STRINGS.LOGOUT_TITLE}</span>
				<LogoutSection onSignOutAction={handleSignOut} />
			</div>
		</Dialog>
	);
};
