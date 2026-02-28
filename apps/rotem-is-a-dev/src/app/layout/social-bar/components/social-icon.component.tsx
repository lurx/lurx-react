import { FaIcon } from '@/app/components';
import styles from '../social-bar.module.scss';
import type { SocialIconProps } from './social-icon.types';

export const SocialIcon = ({ link }: SocialIconProps) => (
	<FaIcon
		iconName={link.icon.iconName}
		iconGroup={link.icon.iconGroup}
		className={styles.socialIcon}
	/>
);
