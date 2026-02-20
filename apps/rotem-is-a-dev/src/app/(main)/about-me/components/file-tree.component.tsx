import { FaIcon } from '@/app/components';
import styles from './file-tree.module.scss';

const FileItem = ({
	label,
	active = false,
}: {
	label: string;
	active?: boolean;
}) => (
	<div className={`${styles.fileRow} ${active ? styles.activeFile : ''}`}>
		<span className={styles.fileIcon}>
			<FaIcon
				iconName="file-lines"
				iconGroup="fal"
			/>
		</span>
		<span className={styles.fileLabel}>{label}</span>
	</div>
);

export const FileTree = () => {
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
					<FileItem label="bio" />
					<FileItem label="interests" />

					{/* education folder */}
					<div className={styles.folderRow}>
						<span className={styles.folderChevron}>
							<FaIcon
								iconName="chevron-down"
								iconGroup="fas"
							/>
						</span>
						<span className={styles.folderIcon}>
							<FaIcon
								iconName="folder-open"
								iconGroup="fas"
							/>
						</span>
						<span className={styles.folderLabel}>education</span>
					</div>

					<div className={styles.nestedItems}>
						<FileItem label="high-school" />
						<FileItem
							label="university"
							active
						/>
					</div>
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
							rotemhorovitz@gmail.com
						</span>
					</div>
					<div className={styles.contactRow}>
						<span className={styles.contactIcon}>
							<FaIcon
								iconName="phone"
								iconGroup="fal"
							/>
						</span>
						<span className={styles.contactLabel}>+972526430444</span>
					</div>
				</div>
			</div>
		</>
	);
};
