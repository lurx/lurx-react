'use client';

import { EmptyState } from '@/app/components/empty-state/empty-state.component';
import { EMPTY_STATE_VARIANTS } from '@/app/components/empty-state/empty-state.constants';
import { toCodeLike } from '@/app/utils/to-code-like.util';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from './about-page.module.scss';
import { AboutContent, AboutEditor, FileTree, SideBar } from './components';
import type { AboutFileId } from './data/about-files.data';
import { ABOUT_FILES, DEFAULT_FILE_ID, getFileSection } from './data/about-files.data';

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

	const searchParams = useSearchParams();
	const playGame = searchParams.get('play-game');

	useEffect(() => {
		if (playGame === 'snake') handleFileSelect('snake-game');
	}, [playGame, handleFileSelect]);

	const activeFile = activeFileId ? ABOUT_FILES[activeFileId] : null;
	const activeSection = activeFileId ? getFileSection(activeFileId) : null;

	const editorContent = activeFile ? (
		<AboutEditor content={activeFile} />
	) : (
		<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
			{toCodeLike('No file selected. Choose a file to learn more about me.', {
				convertCase: 'comment',
			})}
		</EmptyState>
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
				activeSection={activeSection}
				onTabSelect={handleTabSelect}
				onTabClose={handleTabClose}
				onCloseOthers={handleCloseOthers}
				onCloseAll={handleCloseAll}
			>
				{editorContent}
			</AboutContent>
		</div>
	);
};
