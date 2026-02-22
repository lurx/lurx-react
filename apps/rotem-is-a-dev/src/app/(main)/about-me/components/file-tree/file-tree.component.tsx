import { FaIcon } from '@/app/components';
import type { AboutFileId } from '../../data/about-files.data';
import styles from './file-tree.module.scss';

const FileItem = ({
	label,
	active,
	onClick,
}: {
	label: string;
	active?: boolean;
	onClick?: () => void;
}) => (
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

export interface FileTreeProps {
	activeFileId: AboutFileId;
	onFileSelect: (fileId: AboutFileId) => void;
}

export const FileTree = ({ activeFileId, onFileSelect }: FileTreeProps) => {
	return (
		<>
			{/* personal-info section */}
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<span className={styles.sectionChevron}>
						<FaIcon
							iconName="chevron-down"
							iconGroup="fas"
						/>
					</span>
					<span>personal-info</span>
				</div>

				<div className={styles.sectionItems}>
					<FileItem
						label="bio"
						active={activeFileId === 'bio'}
						onClick={() => onFileSelect('bio')}
					/>
					<FileItem
						label="interests"
						active={activeFileId === 'interests'}
						onClick={() => onFileSelect('interests')}
					/>
				</div>
			</div>

			{/* contacts section */}
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<span className={styles.sectionChevron}>
						<FaIcon
							iconName="chevron-down"
							iconGroup="fas"
						/>
					</span>
					<span>contacts</span>
				</div>

				<div className={styles.sectionItems}>
					<div className={styles.contactRow}>
						<span className={styles.contactIcon}>
							<FaIcon
								iconName="envelope"
								iconGroup="fal"
							/>
						</span>
						<span className={styles.contactLabel}>
							lurxie@gmail.com
						</span>
					</div>
					<div className={styles.contactRow}>
						<span className={styles.contactIcon}>
							<FaIcon
								iconName="phone"
								iconGroup="fal"
							/>
						</span>
						<span className={styles.contactLabel}>(+972) 052 522 9225</span>
					</div>
				</div>
			</div>
		</>
	);
};
