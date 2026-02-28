import styles from '../social-bar.module.scss';
import { SocialLink } from './social-link.component';
import type { SocialLinkListProps } from './social-links-list.types';

export const SocialLinkList = ({ links }: SocialLinkListProps) => (
	<ul className={styles.socialLinksList}>
		{Object.values(links).map(link => (
			<li key={link.label}>
				<SocialLink link={link} />
			</li>
		))}
	</ul>
);
