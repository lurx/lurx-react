import { SignInDialog } from '@/app/components/sign-in-dialog';
import { useCallback, useState } from 'react';
import { SIGN_IN_PROMPT_STRINGS } from './sign-in-prompt.constants';
import styles from './sign-in-prompt.module.scss';

export const SignInPrompt = () => {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleOpen = useCallback(() => setIsSignInOpen(true), []);
	const handleClose = useCallback(() => setIsSignInOpen(false), []);

	return (
		<div className={styles.prompt} data-testid="sign-in-prompt">
			<span className={styles.message}>{SIGN_IN_PROMPT_STRINGS.MESSAGE}</span>
			<button
				type="button"
				className={styles.signInButton}
				onClick={handleOpen}
				data-testid="sign-in-prompt-button"
			>
				{SIGN_IN_PROMPT_STRINGS.BUTTON}
			</button>
			<SignInDialog isOpen={isSignInOpen} onCloseAction={handleClose} />
		</div>
	);
};
