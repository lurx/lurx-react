import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from './button.module.scss';

type ButtonProps = {
	variant?: 'primary' | 'secondary' | 'ghost';
	onClick: () => void;
	disabled?: boolean;
}

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
