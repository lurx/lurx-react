import type { AboutFileId, SectionId } from '../../../data/about-files.data';

export type FileTreeSectionProps = {
	id: SectionId;
	files: string[];
	activeFileId: Nullable<AboutFileId>;
	toggleSection: (sectionId: string) => void;
	isCollapsed: boolean;
	onFileSelect: (fileId: AboutFileId) => void;
	isMobile: boolean;
}
