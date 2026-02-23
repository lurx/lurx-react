'use client';

import { useState } from 'react';
import { FaIcon } from '@/app/components';
import { useResponsive } from '@/hooks';
import { MobilePageTitle } from '@/app/(main)/components/mobile-page-title';
import type { Technology } from '../../data/projects.data';
import type { TechnologyFilterProps } from './technology-filter.types';
import styles from './technology-filter.module.scss';

const TECH_ICON_MAP: Record<
	Technology,
	{ iconName: string; iconGroup: string }
> = {
	React: { iconName: 'react', iconGroup: 'fab' },
	TypeScript: { iconName: 'js', iconGroup: 'fab' },
	HTML: { iconName: 'html5', iconGroup: 'fab' },
	CSS: { iconName: 'css', iconGroup: 'fab' },
	SCSS: { iconName: 'sass', iconGroup: 'fab' },
};

export const TechnologyFilter = ({
	technologies,
	selected,
	onToggle,
}: TechnologyFilterProps) => {
	const { isMobile } = useResponsive();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const showTechList = !isMobile || !isCollapsed;

	return (
		<div
			className={styles.filter}
			role="group"
			aria-label="Filter projects by technology"
		>
			<MobilePageTitle title="_projects" />

			<button
				type="button"
				className={styles.sectionHeader}
				aria-expanded={showTechList}
				onClick={() => isMobile && setIsCollapsed(prev => !prev)}
			>
				<span className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ''}`}>
					<FaIcon
						iconName="chevron-down"
						iconGroup="fas"
					/>
				</span>
				<span className={styles.sectionLabel}>projects</span>
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
												iconGroup={iconInfo.iconGroup as 'fab' | 'fas'}
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
