'use client';

import { useCallback, useState } from 'react';
import { useResponsive } from '@/hooks';
import { MobilePageTitle } from '@/app/(main)/components/mobile-page-title';
import type { AboutFileId } from '../../data/about-files.data';
import { SECTIONS, SECTION_FILES } from '../../data/about-files.data';
import { FileTreeSection } from './components';
import styles from './file-tree.module.scss';

export type FileTreeProps = {
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
			<MobilePageTitle title="_about-me" />

			{SECTIONS.map(({ id }) => {
				const files = SECTION_FILES[id];
				if (files.length === 0) return null;
				if (isMobile && id === 'gaming') return null;

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
		</nav>
	);
};
