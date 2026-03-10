'use client';

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

export const UserSettingsDialog = ({ isOpen, onClose }: UserSettingsDialogProps) => {
	const { user, signOut, deleteUser } = useAuth();

	const handleSignOut = useCallback(async () => {
		await signOut();
		onClose();
	}, [signOut, onClose]);

	const handleDeleteAccount = useCallback(async () => {
		await deleteUser();
		onClose();
	}, [deleteUser, onClose]);

	if (!user) return null;

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			ariaLabel={USER_SETTINGS_STRINGS.DIALOG_LABEL}
			className={styles.settingsDialog}
		>
			<span className={styles.title}>{USER_SETTINGS_STRINGS.TITLE}</span>
			<div className={styles.section}>
				<span className={styles.sectionTitle}>{USER_SETTINGS_STRINGS.GENERAL_TITLE}</span>
				<GeneralSection user={user} />
			</div>
			<div className={styles.divider} />
			<div className={styles.section}>
				<span className={styles.sectionTitle}>{USER_SETTINGS_STRINGS.ACCESSIBILITY_TITLE}</span>
				<AccessibilitySection />
			</div>
			<div className={styles.divider} />
			<div className={styles.section}>
				<span className={styles.sectionTitle} data-name="danger-zone">{USER_SETTINGS_STRINGS.DANGER_ZONE_TITLE}</span>
				<DangerZoneSection onDeleteAccount={handleDeleteAccount} />
			</div>
			<div className={styles.divider} />
			<div className={styles.section}>
				<span className={styles.sectionTitle}>{USER_SETTINGS_STRINGS.LOGOUT_TITLE}</span>
				<LogoutSection onSignOut={handleSignOut} />
			</div>
		</Dialog>
	);
};
