import type { AboutFileId } from '../../data/about-files.data';

export type SideBarProps = {
	activeFileId: Nullable<AboutFileId>;
	onFileSelect: (fileId: AboutFileId) => void;
}
