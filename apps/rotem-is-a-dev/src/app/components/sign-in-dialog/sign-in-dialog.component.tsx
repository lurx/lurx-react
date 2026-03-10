import { useAuth } from '@/app/context/auth';
import { useCallback } from 'react';
import { Dialog } from '../dialog';
import { SIGN_IN_DIALOG_STRINGS } from './sign-in-dialog.constants';
import styles from './sign-in-dialog.module.scss';
import type { SignInDialogProps } from './sign-in-dialog.types';
import { AUTH_PROVIDERS } from '@/app/context/auth/auth.constants';
import { SignInWithProviderButton } from './components/sign-in-with-provider-button.component';

export const SignInDialog = ({ isOpen, onClose }: SignInDialogProps) => {
	const { signInWithGoogle, signInWithGitHub } = useAuth();
	const authProviders = Object.values(AUTH_PROVIDERS);

	const handleGoogle = useCallback(async () => {
		onClose();
		await signInWithGoogle();
	}, [onClose, signInWithGoogle]);

	const handleGitHub = useCallback(async () => {
		onClose();
		await signInWithGitHub();
	}, [onClose, signInWithGitHub]);

	return (
		<Dialog isOpen={isOpen} onClose={onClose} ariaLabel={SIGN_IN_DIALOG_STRINGS.DIALOG_LABEL}>
			<span className={styles.title}>{SIGN_IN_DIALOG_STRINGS.TITLE}</span>
			<p className={styles.whyLogin}>{SIGN_IN_DIALOG_STRINGS.WHY_LOGIN}</p>
			<div className={styles.providers}>
				{authProviders.map(provider => {
					return (
						<SignInWithProviderButton
							key={provider}
							provider={provider}
							handleGoogleLogin={handleGoogle}
							handleGitHubLogin={handleGitHub}
						/>
					);
				})}
			</div>
		</Dialog>
	);
};
