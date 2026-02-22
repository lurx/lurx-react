import styles from '../social-bar.module.scss';
import type { SocialLinks } from '../social-bar.types';
import { SocialLink } from './social-link.component';

interface SocialLinkListProps {
	links: SocialLinks;
}

export const SocialLinkList = ({ links }: SocialLinkListProps) => (
	<ul className={styles.socialLinksList}>
		{Object.values(links).map(link => (
			<li key={link.label}>
				<SocialLink link={link} />
			</li>
		))}
	</ul>
);
