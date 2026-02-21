'use client';

import { useCallback, useState } from 'react';
import { FaIcon } from '@/app/components';
import { AboutEditor } from '../about-editor/about-editor.component';
import { FileTree } from '../file-tree/file-tree.component';
import { GistPanel } from '../gist-panel/gist-panel.component';
import { ABOUT_FILES, DEFAULT_FILE_ID } from '../../data/about-files.data';
import type { AboutFileId } from '../../data/about-files.data';
import styles from './about-page.module.scss';

export const AboutPage = () => {
	const [activeFileId, setActiveFileId] =
		useState<AboutFileId>(DEFAULT_FILE_ID);
	const [openTabs, setOpenTabs] = useState<AboutFileId[]>([DEFAULT_FILE_ID]);

	const handleFileSelect = useCallback((fileId: AboutFileId) => {
		setOpenTabs((prev) =>
			prev.includes(fileId) ? prev : [...prev, fileId],
		);
		setActiveFileId(fileId);
	}, []);

	const handleTabSelect = useCallback((fileId: AboutFileId) => {
		setActiveFileId(fileId);
	}, []);

	const handleTabClose = useCallback(
		(fileId: AboutFileId, event: React.MouseEvent) => {
			event.stopPropagation();

			setOpenTabs((prev) => {
				const updated = prev.filter((id) => id !== fileId);
				if (updated.length === 0) return prev;
				return updated;
			});

			setActiveFileId((current) => {
				if (current !== fileId) return current;
				const remaining = openTabs.filter((id) => id !== fileId);
				return remaining.length > 0
					? remaining[remaining.length - 1]
					: DEFAULT_FILE_ID;
			});
		},
		[openTabs],
	);

	return (
		<div className={styles.page}>
			<aside
				className={styles.sidebar}
				aria-label="About sections"
			>
				<button
					className={styles.sidebarIcon}
					aria-label="Professional info"
					type="button"
				>
					<FaIcon
						iconName="briefcase"
						iconGroup="fal"
					/>
				</button>
				<button
					className={`${styles.sidebarIcon} ${styles.activeIcon}`}
					aria-label="Personal info"
					type="button"
				>
					<FaIcon
						iconName="user"
						iconGroup="fal"
					/>
				</button>
				<button
					className={styles.sidebarIcon}
					aria-label="Hobbies"
					type="button"
				>
					<FaIcon
						iconName="gamepad"
						iconGroup="fal"
					/>
				</button>
			</aside>

			<div
				className={styles.fileTree}
				role="navigation"
				aria-label="File tree"
			>
				<FileTree
					activeFileId={activeFileId}
					onFileSelect={handleFileSelect}
				/>
			</div>

			<div className={styles.content}>
				<div
					className={styles.tabBar}
					role="tablist"
				>
					{openTabs.map((tabId) => (
						<div
							key={tabId}
							className={`${styles.tab} ${tabId === activeFileId ? styles.activeTab : ''}`}
							role="tab"
							aria-selected={tabId === activeFileId}
							onClick={() => handleTabSelect(tabId)}
						>
							<span>{ABOUT_FILES[tabId].title}</span>
							<button
								type="button"
								className={styles.tabClose}
								aria-label={`Close ${tabId} tab`}
								onClick={(event) =>
									handleTabClose(tabId, event)
								}
							>
								<FaIcon
									iconName="xmark"
									iconGroup="fas"
									size="xs"
								/>
							</button>
						</div>
					))}
				</div>

				<div className={styles.panels}>
					<AboutEditor content={ABOUT_FILES[activeFileId]} />
					<GistPanel />
				</div>
			</div>
		</div>
	);
};
