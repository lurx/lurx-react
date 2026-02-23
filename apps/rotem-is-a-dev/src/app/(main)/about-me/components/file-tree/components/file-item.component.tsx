import { FaIcon } from '@/app/components';
import styles from '../file-tree.module.scss';

interface FileItemProps {
	label: string;
	active?: boolean;
	onClick?: () => void;
}

export const FileItem = ({ label, active, onClick }: FileItemProps) => (
	<button
		type="button"
		className={`${styles.fileRow} ${active ? styles.activeFile : ''}`}
		onClick={onClick}
	>
		<span className={styles.fileIcon}>
			<FaIcon
				iconName="file-lines"
				iconGroup="fal"
			/>
		</span>
		<span className={styles.fileLabel}>{label}</span>
	</button>
);
