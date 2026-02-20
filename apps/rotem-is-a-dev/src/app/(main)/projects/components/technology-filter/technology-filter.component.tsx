import { FaIcon } from '@/app/components';
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
	CSS: { iconName: 'css3-alt', iconGroup: 'fab' },
};

export const TechnologyFilter = ({
	technologies,
	selected,
	onToggle,
}: TechnologyFilterProps) => {
	return (
		<div
			className={styles.filter}
			role="group"
			aria-label="Filter projects by technology"
		>
			<div className={styles.sectionHeader}>
				<span className={styles.chevron}>
					<FaIcon
						iconName="chevron-down"
						iconGroup="fas"
					/>
				</span>
				<span className={styles.sectionLabel}>projects</span>
			</div>

			<div className={styles.techList}>
				{technologies.map((tech) => {
					const isChecked = selected.includes(tech);
					const iconInfo = TECH_ICON_MAP[tech];

					return (
						<div
							key={tech}
							className={styles.techRow}
							onClick={() => onToggle(tech)}
							role="checkbox"
							aria-checked={isChecked}
							aria-label={tech}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === ' ' || e.key === 'Enter') onToggle(tech);
							}}
						>
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
						</div>
					);
				})}
			</div>
		</div>
	);
};
