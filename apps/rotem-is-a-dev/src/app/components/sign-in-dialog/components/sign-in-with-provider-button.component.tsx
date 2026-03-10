import { AUTH_PROVIDERS } from '@/app/context/auth/auth.constants';
import { FaIcon } from '../../fa-icon';
import { SIGN_IN_DIALOG_STRINGS } from '../sign-in-dialog.constants';
import styles from '../sign-in-dialog.module.scss';

export const SignInWithProviderButton = ({
	provider,
	handleGoogleLogin,
	handleGitHubLogin,
}: {
	provider: string;
	handleGoogleLogin: () => void;
	handleGitHubLogin: () => void;
}) => {
	const upperCaseProvider =
		provider.toUpperCase() as keyof typeof SIGN_IN_DIALOG_STRINGS;
	const providerString = SIGN_IN_DIALOG_STRINGS[upperCaseProvider] || provider;
	const handler =
		provider === AUTH_PROVIDERS.GOOGLE ? handleGoogleLogin : handleGitHubLogin;

	return (
		<button
			type="button"
			className={styles.providerButton}
			onClick={handler}
			data-testid={`sign-in-${provider}`}
		>
			<FaIcon
				iconName={provider.toLowerCase()}
				iconGroup="fab"
				size="lg"
			/>
			Sign in with {providerString}
		</button>
	);
};
