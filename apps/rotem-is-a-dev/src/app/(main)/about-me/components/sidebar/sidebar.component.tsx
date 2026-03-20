import { useResponsive } from '@/hooks';
import {
	getFileSection,
	SECTIONS,
	SECTION_FILES,
} from '../../data/about-files.data';
import { SideBarButton } from '../sidebar-button';
import styles from './sidebar.module.scss';
import type { SideBarProps } from './sidebar.types';

export const SideBar = ({ activeFileId, onFileSelectAction }: SideBarProps) => {
	const { isMobile } = useResponsive();

	const activeSection = activeFileId ? getFileSection(activeFileId) : null;

	if (isMobile) {
		return null;
	}

	return (
		<aside
			className={styles.sidebar}
			aria-label="About sections"
		>
			{SECTIONS.map(({ id, label, icon }) => {
				const defaultFile = SECTION_FILES[id][0];
				if (!defaultFile) return null;

				return (
					<SideBarButton
						key={id}
						ariaLabel={label}
						iconName={icon}
						isActive={activeSection === id}
						onClick={() => onFileSelectAction(defaultFile)}
					/>
				);
			})}
		</aside>
	);
};
