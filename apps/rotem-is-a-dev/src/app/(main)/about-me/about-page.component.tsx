'use client';

import { toCodeLike } from '@/app/utils/to-code-like.util';
import { useCallback, useState } from 'react';
import styles from './about-page.module.scss';
import { AboutContent, AboutEditor, FileTree, GistPanel, SideBar } from './components';
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
		(fileId: AboutFileId) => {
			const updatedTabs = openTabs.filter(id => id !== fileId);
			setOpenTabs(updatedTabs);
			setActiveFileId(prev =>
				prev === fileId ? updatedTabs[updatedTabs.length - 1] ?? null : prev,
			);
		},
		[openTabs],
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

	const editorContent = activeFile ? (
		<AboutEditor content={activeFile} />
	) : (
		<p className={styles.emptyState}>
			{toCodeLike('no file selected. choose a file to learn more about me', {
				convertCase: 'comment',
			})}
		</p>
	);

	return (
		<div className={styles.page}>
			<SideBar
				activeFileId={activeFileId}
				onFileSelect={handleFileSelect}
			/>

			<FileTree
				activeFileId={activeFileId}
				onFileSelect={handleFileSelect}
			/>

			<AboutContent
				openTabs={openTabs}
				activeFileId={activeFileId}
				onTabSelect={handleTabSelect}
				onTabClose={handleTabClose}
				onCloseOthers={handleCloseOthers}
				onCloseAll={handleCloseAll}
			>
				{editorContent}
				<GistPanel />
			</AboutContent>
		</div>
	);
};
