'use client';

import { FaIcon } from '@/app/components';
import { useEntryAnimation } from './entry-animation.context';
import styles from './replay-button.module.scss';

export const ReplayButton = () => {
	const { isShellLoaded, triggerReplay } = useEntryAnimation();

	if (!isShellLoaded) return null;

	return (
		<button
			className={styles.button}
			onClick={triggerReplay}
			aria-label="Replay intro animation"
			title="Replay intro animation"
			type="button"
		>
			<FaIcon iconName="arrow-rotate-right" iconGroup="fal" />
		</button>
	);
};
