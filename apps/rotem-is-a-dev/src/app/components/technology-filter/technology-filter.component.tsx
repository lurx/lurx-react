'use client';

import { MobilePageTitle } from '@/app/(main)/components/mobile-page-title';
import { FaIcon } from '@/app/components';
import { useResponsive } from '@/hooks';
import { useState } from 'react';
import { TechCheckboxItem } from './tech-checkbox-item.component';
import styles from './technology-filter.module.scss';
import type { TechnologyFilterProps } from './technology-filter.types';

const reactIconData: IconData = { iconName: 'react', iconGroup: 'fab' };

const TECH_ICON_MAP: Partial<Record<string, IconData>> = {
	react: reactIconData,
	typescript: { iconName: 'js', iconGroup: 'fab' },
	html: { iconName: 'html5', iconGroup: 'fab' },
	css: { iconName: 'css', iconGroup: 'fab' },
	scss: { iconName: 'sass', iconGroup: 'fab' },
	svg: { iconName: 'file-svg', iconGroup: 'fas' },
	architecture: { iconName: 'chart-diagram', iconGroup: 'fal' },
	'best-practices': { iconName: 'code', iconGroup: 'fal' },
	components: reactIconData,
};

export const TechnologyFilter = ({
	technologies,
	selected,
	onToggle,
	sectionLabel = 'projects',
}: TechnologyFilterProps) => {
	const { isMobile } = useResponsive();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const showTechList = !isMobile || !isCollapsed;

	const handleToggleCollapse = () => {
		if (isMobile) setIsCollapsed(prev => !prev);
	};

	return (
		<fieldset
			className={styles.filter}
			aria-label={`Filter by ${sectionLabel}`}
		>
			<MobilePageTitle title="_projects" />

			<button
				type="button"
				className={styles.sectionHeader}
				aria-expanded={showTechList}
				onClick={handleToggleCollapse}
			>
				<span className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ''}`}>
					<FaIcon
						iconName="chevron-down"
						iconGroup="fas"
					/>
				</span>
				<span className={styles.sectionLabel}>{sectionLabel}</span>
			</button>

			{showTechList && (
				<div className={styles.techList}>
					{technologies.map((tech) => (
						<TechCheckboxItem
							key={tech}
							tech={tech}
							isChecked={selected.includes(tech)}
							onToggle={onToggle}
							iconInfo={TECH_ICON_MAP[tech]}
						/>
					))}
				</div>
			)}
		</fieldset>
	);
};
