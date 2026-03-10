import { AnimatedLoader } from '@/app/components';
import { LOGO_SIZES } from '@/app/components/logo/logo.constants';
import styles from '../../auth-button.module.scss';

export const AuthButtonLoading = () => {
	return (
		<button
				type="button"
				disabled
				className={styles.avatarButton}
			>
				<AnimatedLoader size={LOGO_SIZES.ICON} />
			</button>
	);
};
