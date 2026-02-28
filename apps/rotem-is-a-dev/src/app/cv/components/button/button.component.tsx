import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from './button.module.scss';
import type { ButtonProps } from './button.types';

export const Button = ({
	variant = 'primary',
	onClick,
	disabled,
	children,
}: PropsWithChildren<ButtonProps>) => {
	const variantClassName = 'button-' + variant; // default to primary
	return (
		<button
			className={classnames(styles.button, styles[variantClassName])}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};
