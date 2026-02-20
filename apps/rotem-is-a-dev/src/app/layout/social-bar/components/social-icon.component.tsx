import { FaIcon } from '@/app/components/fa-icon';
import styles from '../social-bar.module.scss';
import type { SocialLink } from '../social-bar.types';


export const SocialIcon = ({ link }: { link: SocialLink }) => (
	<FaIcon
		iconName={link.icon.iconName}
		iconGroup={link.icon.iconGroup}
		className={styles.socialIcon}
	/>
);
