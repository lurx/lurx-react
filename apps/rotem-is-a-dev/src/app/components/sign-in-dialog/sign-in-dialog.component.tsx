'use client';

import { useAuth } from '@/app/context/auth';
import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEventListener } from 'usehooks-ts';
import { FaIcon } from '../fa-icon';
import { SIGN_IN_DIALOG_STRINGS } from './sign-in-dialog.constants';
import styles from './sign-in-dialog.module.scss';
import type { SignInDialogProps } from './sign-in-dialog.types';

export const SignInDialog = ({ isOpen, onClose }: SignInDialogProps) => {
	const { signInWithGoogle, signInWithGitHub } = useAuth();

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				onClose();
			}
		},
		[isOpen, onClose],
	);

	const handleGoogle = useCallback(async () => {
		onClose();
		await signInWithGoogle();
	}, [onClose, signInWithGoogle]);

	const handleGitHub = useCallback(async () => {
		onClose();
		await signInWithGitHub();
	}, [onClose, signInWithGitHub]);

	useEventListener('keydown', handleKeyDown);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	/* istanbul ignore next -- SSR guard */
	const portalTarget =
		typeof document === 'undefined'
			? null
			: document.getElementById('portal-root') ?? document.body;

	/* istanbul ignore next -- only reachable during SSR */
	if (!portalTarget) return null;

	return createPortal(
		<div className={styles.wrapper} data-testid="sign-in-dialog-wrapper">
			<div
				className={styles.overlay}
				onClick={onClose}
				aria-hidden="true"
				data-testid="sign-in-dialog-overlay"
			/>

			<dialog
				open
				className={styles.card}
				aria-label={SIGN_IN_DIALOG_STRINGS.DIALOG_LABEL}
				data-testid="sign-in-dialog"
			>
				<span className={styles.title}>{SIGN_IN_DIALOG_STRINGS.TITLE}</span>
				<p className={styles.whyLogin}>{SIGN_IN_DIALOG_STRINGS.WHY_LOGIN}</p>
				<div className={styles.providers}>
					<button
						type="button"
						className={styles.providerButton}
						onClick={handleGoogle}
						data-testid="sign-in-google"
					>
						<FaIcon iconName="google" iconGroup="fab" size="lg" />
						{SIGN_IN_DIALOG_STRINGS.GOOGLE}
					</button>

					<button
						type="button"
						className={styles.providerButton}
						onClick={handleGitHub}
						data-testid="sign-in-github"
					>
						<FaIcon iconName="github" iconGroup="fab" size="lg" />
						{SIGN_IN_DIALOG_STRINGS.GITHUB}
					</button>
				</div>
			</dialog>
		</div>,
		portalTarget,
	);
};
