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
	onTabSelectAction,
	onTabCloseAction,
	onCloseOthersAction,
	onCloseAllAction,
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
		if (contextMenu) onTabCloseAction(contextMenu.tabId);
	};
	const handleContextMenuCloseOthers = () => {
		if (contextMenu) onCloseOthersAction(contextMenu.tabId);
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
					onSelectAction={onTabSelectAction}
					onCloseAction={onTabCloseAction}
					onContextMenuAction={handleContextMenu}
				/>
			))}

			{contextMenu && (
				<TabContextMenu
					position={{ x: contextMenu.x, y: contextMenu.y }}
					onCloseAction={handleContextMenuClose}
					onCloseOthersAction={handleContextMenuCloseOthers}
					onCloseAllAction={onCloseAllAction}
					onDismissAction={dismissMenu}
				/>
			)}
		</div>
	);
};
