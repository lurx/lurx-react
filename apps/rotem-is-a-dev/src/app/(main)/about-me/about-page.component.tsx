'use client';

import { useCallback, useState } from 'react';
import styles from './about-page.module.scss';
import { AboutEditor, FileTree, GistPanel, SideBar, TabBar } from './components';
import type { AboutFileId } from './data/about-files.data';
import { ABOUT_FILES, DEFAULT_FILE_ID } from './data/about-files.data';

export const AboutPage = () => {
	const [activeFileId, setActiveFileId] =
		useState<Nullable<AboutFileId>>(DEFAULT_FILE_ID);
	const [openTabs, setOpenTabs] = useState<AboutFileId[]>([DEFAULT_FILE_ID]);

	const handleFileSelect = useCallback((fileId: AboutFileId) => {
		setOpenTabs(prev => (prev.includes(fileId) ? prev : [...prev, fileId]));
		setActiveFileId(fileId);
	}, []);

	const handleTabSelect = useCallback((fileId: AboutFileId) => {
		setActiveFileId(fileId);
	}, []);

	const handleTabClose = useCallback(
		(fileId: AboutFileId, event: React.MouseEvent) => {
			event.stopPropagation();

			const updatedTabs = openTabs.filter(id => id !== fileId);
			setOpenTabs(updatedTabs);

			if (activeFileId === fileId) {
				setActiveFileId(updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : null);
			}
		},
		[openTabs, activeFileId],
	);

	const handleCloseOthers = useCallback((fileId: AboutFileId) => {
		setOpenTabs([fileId]);
		setActiveFileId(fileId);
	}, []);

	const handleCloseAll = useCallback(() => {
		setOpenTabs([]);
		setActiveFileId(null);
	}, []);

	const activeFile = activeFileId ? ABOUT_FILES[activeFileId] : null;

	return (
		<div className={styles.page}>
			<SideBar activeFileId={activeFileId} onFileSelect={handleFileSelect} />

			<FileTree
				activeFileId={activeFileId}
				onFileSelect={handleFileSelect}
			/>

			<div className={styles.content}>
				<TabBar
					openTabs={openTabs}
					activeFileId={activeFileId}
					onTabSelect={handleTabSelect}
					onTabClose={handleTabClose}
					onCloseOthers={handleCloseOthers}
					onCloseAll={handleCloseAll}
				/>

				<div className={styles.panels}>
					{activeFile ? (
						<AboutEditor content={activeFile} />
					) : (
						<p className={styles.emptyState}>choose a file</p>
					)}
					<GistPanel />
				</div>
			</div>
		</div>
	);
};
