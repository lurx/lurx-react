import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from '../wolverine.module.scss';
import type { WolverineSideProp } from '../wolverine.types';

export const WolverinePeck = ({
	side,
	children,
}: PropsWithChildren<WolverineSideProp>) => (
	<div className={classNames(styles.peck, styles[side])}>
		{children}
		<div className={styles.shoulderpad} />
	</div>
);
