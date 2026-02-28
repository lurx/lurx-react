'use client';

import { useResponsive } from '@/hooks';
import { useState } from 'react';
import type { AboutFileId } from '../../data/about-files.data';
import styles from './tab-bar.module.scss';
import type { ContextMenuState, TabBarProps } from './tab-bar.types';
import { Tab } from './tab.component';
import { TabContextMenu } from './tab-context-menu.component';

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

	const handleContextMenuClose = () => {
		if (contextMenu) onTabClose(contextMenu.tabId);
	};
	const handleContextMenuCloseOthers = () => {
		if (contextMenu) onCloseOthers(contextMenu.tabId);
	};

	return (
		<div
			className={styles.tabBar}
			role="tablist"
		>
			{openTabs.map(tabId => (
				<Tab
					key={tabId}
					tabId={tabId}
					isActive={tabId === activeFileId}
					onSelect={onTabSelect}
					onClose={onTabClose}
					onContextMenu={handleContextMenu}
				/>
			))}

			{contextMenu && (
				<TabContextMenu
					position={{ x: contextMenu.x, y: contextMenu.y }}
					onClose={handleContextMenuClose}
					onCloseOthers={handleContextMenuCloseOthers}
					onCloseAll={onCloseAll}
					onDismiss={dismissMenu}
				/>
			)}
		</div>
	);
};
