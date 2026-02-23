'use client';

import { FaIcon } from '@/app/components';
import { useResponsive } from '@/hooks';
import { useState } from 'react';
import type { AboutFileId } from '../../data/about-files.data';
import { ABOUT_FILES } from '../../data/about-files.data';
import styles from './tab-bar.module.scss';
import { TabContextMenu } from './tab-context-menu.component';

interface TabBarProps {
	openTabs: AboutFileId[];
	activeFileId: Nullable<AboutFileId>;
	onTabSelect: (fileId: AboutFileId) => void;
	onTabClose: (fileId: AboutFileId, event: React.MouseEvent) => void;
	onCloseOthers: (fileId: AboutFileId) => void;
	onCloseAll: () => void;
}

interface ContextMenuState {
	tabId: AboutFileId;
	x: number;
	y: number;
}

export const TabBar = ({
	openTabs,
	activeFileId,
	onTabSelect,
	onTabClose,
	onCloseOthers,
	onCloseAll,
}: TabBarProps) => {
	const { isMobile } = useResponsive();
	const [contextMenu, setContextMenu] = useState<Nullable<ContextMenuState>>(null);

	if (isMobile) return null;

	const handleContextMenu = (tabId: AboutFileId, event: React.MouseEvent) => {
		event.preventDefault();
		setContextMenu({ tabId, x: event.clientX, y: event.clientY });
	};

	const dismissMenu = () => setContextMenu(null);

	return (
		<div
			className={styles.tabBar}
			role="tablist"
		>
			{openTabs.map(tabId => (
				<div
					key={tabId}
					className={`${styles.tab} ${tabId === activeFileId ? styles.activeTab : ''}`}
					role="tab"
					aria-selected={tabId === activeFileId}
					onClick={() => onTabSelect(tabId)}
					onContextMenu={event => handleContextMenu(tabId, event)}
				>
					<span>{ABOUT_FILES[tabId].title}</span>
					<button
						type="button"
						className={styles.tabClose}
						aria-label={`Close ${tabId} tab`}
						onClick={event => onTabClose(tabId, event)}
					>
						<FaIcon
							iconName="xmark"
							iconGroup="fas"
							size="xs"
						/>
					</button>
				</div>
			))}

			{contextMenu && (
				<TabContextMenu
					position={{ x: contextMenu.x, y: contextMenu.y }}
					onClose={() => onTabClose(contextMenu.tabId, { stopPropagation: () => {} } as React.MouseEvent)}
					onCloseOthers={() => onCloseOthers(contextMenu.tabId)}
					onCloseAll={onCloseAll}
					onDismiss={dismissMenu}
				/>
			)}
		</div>
	);
};
