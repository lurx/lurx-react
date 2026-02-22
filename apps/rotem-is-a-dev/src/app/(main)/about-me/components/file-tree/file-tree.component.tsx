'use client';

import { FaIcon } from '@/app/components';
import { useCallback, useState } from 'react';
import type { AboutFileId } from '../../data/about-files.data';
import { ABOUT_FILES, SECTIONS, SECTION_FILES } from '../../data/about-files.data';
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
	activeFileId: Nullable<AboutFileId>;
	onFileSelect: (fileId: AboutFileId) => void;
}

export const FileTree = ({ activeFileId, onFileSelect }: FileTreeProps) => {
	const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
		new Set(),
	);

	const toggleSection = useCallback((sectionId: string) => {
		setCollapsedSections(prev => {
			const next = new Set(prev);
			if (next.has(sectionId)) {
				next.delete(sectionId);
			} else {
				next.add(sectionId);
			}
			return next;
		});
	}, []);

	return (
		<nav
			className={styles.fileTree}
			aria-label="File tree"
		>
			{SECTIONS.map(({ id }) => {
				const files = SECTION_FILES[id];
				if (files.length === 0) return null;

				const isCollapsed = collapsedSections.has(id);

				return (
					<div
						key={id}
						className={styles.section}
					>
						<button
							type="button"
							className={styles.folderRow}
							aria-expanded={!isCollapsed}
							onClick={() => toggleSection(id)}
						>
							<span className={styles.folderChevron}>
								<FaIcon
									iconName={isCollapsed ? 'chevron-right' : 'chevron-down'}
									iconGroup="fas"
								/>
							</span>
							<span className={styles.folderIcon}>
								<FaIcon
									iconName={isCollapsed ? 'folder-plus' : 'folder-minus'}
									iconGroup="fal"
								/>
							</span>
							<span className={styles.folderLabel}>{id}</span>
						</button>

						{!isCollapsed && (
							<div className={styles.nestedItems}>
								{files.map(fileId => (
									<FileItem
										key={fileId}
										label={ABOUT_FILES[fileId].title}
										active={activeFileId === fileId}
										onClick={() => onFileSelect(fileId)}
									/>
								))}
							</div>
						)}
					</div>
				);
			})}

			{/* contacts section */}
			<div className={styles.section}>
				<button
					type="button"
					className={styles.folderRow}
					aria-expanded={!collapsedSections.has('contacts')}
					onClick={() => toggleSection('contacts')}
				>
					<span className={styles.folderChevron}>
						<FaIcon
							iconName={
								collapsedSections.has('contacts')
									? 'chevron-right'
									: 'chevron-down'
							}
							iconGroup="fas"
						/>
					</span>
					<span className={styles.folderIcon}>
						<FaIcon
							iconName={
								collapsedSections.has('contacts')
									? 'folder-plus'
									: 'folder-minus'
							}
							iconGroup="fal"
						/>
					</span>
					<span className={styles.folderLabel}>contacts</span>
				</button>

				{!collapsedSections.has('contacts') && (
					<div className={styles.nestedItems}>
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
							<span className={styles.contactLabel}>
								(+972) 052 522 9225
							</span>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};
