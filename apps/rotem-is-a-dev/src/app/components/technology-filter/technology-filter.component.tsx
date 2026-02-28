'use client';

import { MobilePageTitle } from '@/app/(main)/components/mobile-page-title';
import { FaIcon } from '@/app/components';
import { useResponsive } from '@/hooks';
import { useState } from 'react';
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
		<div
			className={styles.filter}
			role="group"
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
					{technologies.map((tech) => {
						const isChecked = selected.includes(tech);
						const iconInfo = TECH_ICON_MAP[tech];

						return (
							<label
								key={tech}
								className={styles.techRow}
							>
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => onToggle(tech)}
									className={styles.hiddenCheckbox}
								/>
								<span
									className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}
									aria-hidden="true"
								>
									{isChecked && (
										<FaIcon
											iconName="check"
											iconGroup="fas"
										/>
									)}
								</span>

								<span className={styles.techLabel}>
									{iconInfo && (
										<span className={styles.techIcon}>
											<FaIcon
												iconName={iconInfo.iconName}
												iconGroup={iconInfo.iconGroup}
											/>
										</span>
									)}
									<span className={styles.techName}>{tech}</span>
								</span>
							</label>
						);
					})}
				</div>
			)}
		</div>
	);
};
