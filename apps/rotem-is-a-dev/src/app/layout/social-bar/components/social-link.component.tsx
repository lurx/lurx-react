import styles from '../social-bar.module.scss';
import { SocialIcon } from './social-icon.component';
import type { RenderItem, SocialLinkProps } from './social-link.types';

export const SocialLink = ({
	link,
	iconPosition = 'start',
}: SocialLinkProps) => {
	const shouldHideIcon = iconPosition === 'hide';
	const shouldHideLabel = link.hideLabel;

	const icon: RenderItem = {
		key: 'icon',
		element: shouldHideIcon ? undefined : <SocialIcon link={link} />,
	};
	const visibleText = link.displayText ?? link.label;
	const label: RenderItem = {
		key: 'label',
		element: shouldHideLabel ? undefined : (
			<span
				className={styles.label}
				data-animate-text={link.displayText ? 'footer-username' : undefined}
			>
				{visibleText}
			</span>
		),
	};

	const renderOrder: RenderItem[] = iconPosition === 'end' ? [label, icon] : [icon, label];

	return (
		<span className={styles.iconWrapper} data-animate-icon>
			<a
				href={link.url}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.iconLink}
				aria-label={link.label}
			>
				{renderOrder.map(({ key, element }) => (
					<span key={key}>{element}</span>
				))}
			</a>
		</span>
	);
};
