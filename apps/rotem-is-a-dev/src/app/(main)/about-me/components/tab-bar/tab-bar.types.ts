import type { AboutFileId } from '../../data/about-files.data';

export type TabBarProps = {
	openTabs: AboutFileId[];
	activeFileId: Nullable<AboutFileId>;
	onTabSelect: (fileId: AboutFileId) => void;
	onTabClose: (fileId: AboutFileId) => void;
	onCloseOthers: (fileId: AboutFileId) => void;
	onCloseAll: () => void;
}

export type ContextMenuState = {
	tabId: AboutFileId;
	x: number;
	y: number;
}
