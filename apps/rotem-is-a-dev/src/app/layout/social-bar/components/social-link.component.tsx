import { Fragment, type JSX } from 'react';
import styles from '../social-bar.module.scss';
import type { SocialLink } from '../social-bar.types';
import { SocialIcon } from './social-icon.component';

interface SocialLinkItemProps {
	link: SocialLink;
	iconPosition?: 'start' | 'end' | 'hide';
}

const EmptyComponent = () => <Fragment />;

export const SocialLinkItem = ({
	link,
	iconPosition = 'start',
}: SocialLinkItemProps) => {
	const shouldHideIcon = iconPosition === 'hide';
	const shouldHideLabel = link.hideLabel;

	const icon: JSX.Element = shouldHideIcon ? <EmptyComponent /> : <SocialIcon link={link} />;
	const visibleText = link.displayText ?? link.label;
	const label: JSX.Element = shouldHideLabel ? <EmptyComponent /> : <span className={styles.label}>{visibleText}</span>;

	const iconFirst = [icon, label];
	const labelFirst = iconFirst.slice().reverse();

  const renderOrder: JSX.Element[] = iconPosition === 'end' ? labelFirst : iconFirst;

	return (
		<span className={styles.iconWrapper}>
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
