import type { AboutFileId } from '../../data/about-files.data';

export type TabProps = {
	tabId: AboutFileId;
	isActive: boolean;
	onSelect: (fileId: AboutFileId) => void;
	onClose: (fileId: AboutFileId) => void;
	onContextMenu: (tabId: AboutFileId, event: React.MouseEvent) => void;
}
