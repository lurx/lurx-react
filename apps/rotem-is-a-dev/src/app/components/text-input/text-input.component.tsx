import { useId } from 'react';
import type { TextInputProps } from './text-input.types';
import styles from './text-input.module.scss';

export const TextInput = ({ label, ...inputProps }: TextInputProps) => {
	const id = useId();

	return (
		<div className={styles.wrapper}>
			<label
				htmlFor={id}
				className={styles.label}
			>
				{label}
			</label>
			<input
				id={id}
				type="text"
				className={styles.input}
				{...inputProps}
			/>
		</div>
	);
};
