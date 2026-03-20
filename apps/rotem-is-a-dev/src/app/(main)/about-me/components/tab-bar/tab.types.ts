import type { AboutFileId } from '../../data/about-files.data';

export type TabProps = {
	tabId: AboutFileId;
	isActive: boolean;
	onSelectAction: (fileId: AboutFileId) => void;
	onCloseAction: (fileId: AboutFileId) => void;
	onContextMenuAction: (tabId: AboutFileId, event: React.MouseEvent) => void;
}
