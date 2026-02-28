import type { ReactNode } from 'react';
import { FaIcon } from '@/app/components/fa-icon/fa-icon.component';
import styles from './resizable-drawer.module.scss';

interface DrawerHeaderProps {
	title?: ReactNode;
	onClose: () => void;
}

export const DrawerHeader = ({ title, onClose }: DrawerHeaderProps) => (
	<div className={styles.header}>
		{title && <div className={styles.title}>{title}</div>}
		<button
			type="button"
			className={styles.closeButton}
			onClick={onClose}
			aria-label="Close drawer"
			data-testid="resizable-drawer-close"
		>
			<FaIcon
				iconName="xmark"
				iconGroup="fas"
			/>
		</button>
	</div>
);
