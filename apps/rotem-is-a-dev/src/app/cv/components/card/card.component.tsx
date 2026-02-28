import type { PropsWithChildren } from 'react';
import styles from './card.module.scss';
import type { CardProps } from './card.types';

export const Card = ({ id, children }: PropsWithChildren<CardProps>) => {
	return (
		<div
			id={id}
			className={styles.card}
		>
			{children}
		</div>
	);
};
