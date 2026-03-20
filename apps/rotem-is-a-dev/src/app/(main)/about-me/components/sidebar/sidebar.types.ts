import type { AboutFileId } from '../../data/about-files.data';

export type SideBarProps = {
	activeFileId: Nullable<AboutFileId>;
	onFileSelectAction: (fileId: AboutFileId) => void;
}
