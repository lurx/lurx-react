import classNames from 'classnames';
import { CTA_ACTIONS } from './hero-cta-actions.constants';
import styles from './hero-cta-actions.module.scss';
import type { CtaAction } from './hero-cta-actions.types';

const renderAction = (action: CtaAction) => (
	<a
		key={action.id}
		href={action.href}
		className={classNames(styles.button, styles[action.variant])}
	>
		{action.label}
	</a>
);

export const HeroCtaActions = () => (
	<div className={styles.actions} data-hero-intro="cta-actions">
		{CTA_ACTIONS.map(renderAction)}
	</div>
);
