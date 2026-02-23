'use client';

import { useCallback, useState } from 'react';
import { useResponsive } from '@/hooks';
import type { AboutFileId } from '../../data/about-files.data';
import { SECTIONS, SECTION_FILES } from '../../data/about-files.data';
import { FileTreeSection } from './components/filte-tree-section.component';
import styles from './file-tree.module.scss';

export interface FileTreeProps {
	activeFileId: Nullable<AboutFileId>;
	onFileSelect: (fileId: AboutFileId) => void;
}

export const FileTree = ({ activeFileId, onFileSelect }: FileTreeProps) => {
	const { isMobile } = useResponsive();
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
			{isMobile && <h2 className={styles.mobileTitle}>_about-me</h2>}

			{SECTIONS.map(({ id }) => {
				const files = SECTION_FILES[id];
				if (files.length === 0) return null;

				const isCollapsed = collapsedSections.has(id);

				return (
					<FileTreeSection
						key={id}
						id={id}
						files={files}
						activeFileId={activeFileId}
						toggleSection={toggleSection}
						isCollapsed={isCollapsed}
						onFileSelect={onFileSelect}
						isMobile={isMobile}
					/>
				);
			})}

			{/* contacts section */}
			{/* <div className={styles.section}>
				<button
					type="button"
					className={styles.folderRow}
					aria-expanded={!collapsedSections.has('contacts')}
					onClick={() => toggleSection('contacts')}
				>
					<span className={`${styles.folderChevron} ${collapsedSections.has('contacts') ? styles.collapsed : ''}`}>
						<FaIcon
							iconName="chevron-down"
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
			</div> */}
		</nav>
	);
};
