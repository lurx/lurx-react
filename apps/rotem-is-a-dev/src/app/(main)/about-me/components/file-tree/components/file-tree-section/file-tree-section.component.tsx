import { FaIcon } from '@/app/components';
import { ABOUT_FILES } from '../../../../data/about-files.data';
import styles from '../../file-tree.module.scss';
import { FileItem } from '../file-item';
import type { FileTreeSectionProps } from './file-tree-section.types';

export const FileTreeSection = ({
	id,
	files,
	activeFileId,
	toggleSection,
	isCollapsed,
	onFileSelectAction,
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
						const label = ABOUT_FILES[fileId]?.title || fileId;
						return (
							<FileItem
								key={fileId}
								label={label}
								active={activeFileId === fileId}
								onClick={() => onFileSelectAction(fileId)}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
