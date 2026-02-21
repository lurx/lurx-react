import { Fragment, type JSX } from 'react';
import styles from '../social-bar.module.scss';
import type { SocialLink } from '../social-bar.types';
import { SocialIcon } from './social-icon.component';

interface SocialLinkItemProps {
	link: SocialLink;
	iconPosition?: 'start' | 'end' | 'hide';
}

export const SocialLinkItem = ({
	link,
	iconPosition = 'start',
}: SocialLinkItemProps) => {
	const shouldHideIcon = iconPosition === 'hide';
	const shouldHideLabel = link.hideLabel;

	const icon: JSX.Element = shouldHideIcon ? <Fragment /> : <SocialIcon link={link} />;
	const visibleText = link.displayText ?? link.label;
	const label: JSX.Element = shouldHideLabel ? (
		<Fragment />
	) : (
		<span
			className={styles.label}
			data-animate-text={link.displayText ? 'footer-username' : undefined}
		>
			{visibleText}
		</span>
	);

	const iconFirst = [icon, label];
	const labelFirst = iconFirst.slice().reverse();

  const renderOrder: JSX.Element[] = iconPosition === 'end' ? labelFirst : iconFirst;

	return (
		<span className={styles.iconWrapper} data-animate-icon>
			<a
				href={link.url}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.iconLink}
				aria-label={link.label}
			>
				{renderOrder.map((Component, index) => (
					<Fragment key={index}>{Component}</Fragment>
				))}
			</a>
		</span>
	);
};
