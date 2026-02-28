import { FaIcon } from '@/app/components';
import { ABOUT_FILES, type AboutFileId, type SectionId } from '../../../data/about-files.data';
import { FileItem } from './file-item.component';
import styles from '../file-tree.module.scss';

type FileTreeSectionProps = {
	id: SectionId;
	files: string[];
	activeFileId: Nullable<AboutFileId>;
	toggleSection: (sectionId: string) => void;
	isCollapsed: boolean;
	onFileSelect: (fileId: AboutFileId) => void;
	isMobile: boolean;
}

export const FileTreeSection = ({
	id,
	files,
	activeFileId,
	toggleSection,
	isCollapsed,
	onFileSelect,
	isMobile,
}: FileTreeSectionProps) => {
	const handleToggle = () => toggleSection(id);

	const folderIcon = isMobile
		? <span className={`${styles.folderChevron} ${isCollapsed ? styles.collapsed : ''}`}>
				<FaIcon iconName="chevron-down" iconGroup="fas" />
			</span>
		: <span className={styles.folderIcon}>
				<FaIcon iconName={isCollapsed ? 'folder-plus' : 'folder-minus'} iconGroup="fal" />
			</span>;

	return (
		<div
			key={id}
			className={styles.section}
			data-section={id}
		>
			<button
				type="button"
				className={styles.folderRow}
				aria-expanded={!isCollapsed}
				onClick={handleToggle}
			>
				{folderIcon}
				<span className={styles.folderLabel}>{id}</span>
			</button>

			{!isCollapsed && (
				<div className={styles.nestedItems}>
					{files.map(fileId => {
						const label = ABOUT_FILES[fileId as AboutFileId]?.title || fileId;
						return (
							<FileItem
								key={fileId}
								label={label}
								active={activeFileId === fileId}
								onClick={() => onFileSelect(fileId as AboutFileId)}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
