import type { AboutFileId, SectionId } from '../../../../data/about-files.data';

export type FileTreeSectionProps = {
	id: SectionId;
	files: AboutFileId[];
	activeFileId: Nullable<AboutFileId>;
	toggleSection: (sectionId: string) => void;
	isCollapsed: boolean;
	onFileSelectAction: (fileId: AboutFileId) => void;
	isMobile: boolean;
}
