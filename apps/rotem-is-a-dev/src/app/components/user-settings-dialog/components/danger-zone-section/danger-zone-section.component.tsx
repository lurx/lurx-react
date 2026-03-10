import { useCallback, useState } from 'react';
import { USER_SETTINGS_STRINGS } from '../../user-settings-dialog.constants';
import styles from './danger-zone-section.module.scss';
import type { DangerZoneSectionProps } from './danger-zone-section.types';

const REQUIRES_RECENT_LOGIN_CODE = 'auth/requires-recent-login';

export const DangerZoneSection = ({ onDeleteAccount }: DangerZoneSectionProps) => {
	const [isConfirming, setIsConfirming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleStartConfirm = useCallback(() => {
		setIsConfirming(true);
		setError(null);
	}, []);

	const handleCancel = useCallback(() => {
		setIsConfirming(false);
		setError(null);
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		setIsDeleting(true);
		setError(null);
		try {
			await onDeleteAccount();
		} catch (err: unknown) {
			const firebaseError = err as { code?: string };
			if (firebaseError.code === REQUIRES_RECENT_LOGIN_CODE) {
				setError(USER_SETTINGS_STRINGS.DELETE_REQUIRES_REAUTH);
			} else {
				setError(USER_SETTINGS_STRINGS.DELETE_GENERIC_ERROR);
			}
		} finally {
			setIsDeleting(false);
		}
	}, [onDeleteAccount]);

	const renderInitialButton = () => (
		<button
			type="button"
			className={styles.deleteButton}
			onClick={handleStartConfirm}
		>
			{USER_SETTINGS_STRINGS.DELETE_ACCOUNT}
		</button>
	);

	const renderConfirmation = () => (
		<div className={styles.confirmation}>
			<p className={styles.warning}>{USER_SETTINGS_STRINGS.DELETE_WARNING}</p>
			{error && <p className={styles.error}>{error}</p>}
			<div className={styles.actions}>
				<button
					type="button"
					className={styles.cancelButton}
					onClick={handleCancel}
					disabled={isDeleting}
				>
					{USER_SETTINGS_STRINGS.DELETE_CANCEL}
				</button>
				<button
					type="button"
					className={styles.confirmButton}
					onClick={handleConfirmDelete}
					disabled={isDeleting}
				>
					{isDeleting ? USER_SETTINGS_STRINGS.DELETING : USER_SETTINGS_STRINGS.DELETE_CONFIRM}
				</button>
			</div>
		</div>
	);

	return (
		<div className={styles.section}>
			{isConfirming ? renderConfirmation() : renderInitialButton()}
		</div>
	);
};
