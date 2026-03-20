import type { AboutFileId } from '../../data/about-files.data';

export type TabBarProps = {
	openTabs: AboutFileId[];
	activeFileId: Nullable<AboutFileId>;
	onTabSelectAction: (fileId: AboutFileId) => void;
	onTabCloseAction: (fileId: AboutFileId) => void;
	onCloseOthersAction: (fileId: AboutFileId) => void;
	onCloseAllAction: () => void;
}

export type ContextMenuState = {
	tabId: AboutFileId;
	x: number;
	y: number;
}
