import { AUTH_PROVIDERS } from '@/app/context/auth/auth.constants';
import type { AuthProvider } from '@/app/context/auth/auth.context.types';
import { FaIcon } from '../../fa-icon';
import { SIGN_IN_DIALOG_STRINGS } from '../sign-in-dialog.constants';
import styles from '../sign-in-dialog.module.scss';

const PROVIDER_DISPLAY_NAMES: Record<AuthProvider, string> = {
	[AUTH_PROVIDERS.GOOGLE]: SIGN_IN_DIALOG_STRINGS.GOOGLE,
	[AUTH_PROVIDERS.GITHUB]: SIGN_IN_DIALOG_STRINGS.GITHUB,
};

export const SignInWithProviderButton = ({
	provider,
	handleGoogleLogin,
	handleGitHubLogin,
}: {
	provider: AuthProvider;
	handleGoogleLogin: () => void;
	handleGitHubLogin: () => void;
}) => {
	const providerString = PROVIDER_DISPLAY_NAMES[provider];
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
