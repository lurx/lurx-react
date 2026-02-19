import type { PropsWithChildren } from 'react';
import styles from './card.module.scss';

interface CardProps {
	id?: string;
}

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
