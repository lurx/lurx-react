import { FaIcon } from '@/app/components';
import styles from './technology-filter.module.scss';
import type { TechCheckboxItemProps } from './tech-checkbox-item.types';

export const TechCheckboxItem = ({
	tech,
	isChecked,
	onToggle,
	iconInfo,
}: TechCheckboxItemProps) => {
	const handleChange = () => onToggle(tech);

	const checkIcon = isChecked
		? <FaIcon iconName="check" iconGroup="fas" />
		: null;

	const techIcon = iconInfo
		? <span className={styles.techIcon}>
				<FaIcon iconName={iconInfo.iconName} iconGroup={iconInfo.iconGroup} />
			</span>
		: null;

	return (
		<label className={styles.techRow}>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleChange}
				className={styles.hiddenCheckbox}
			/>
			<span
				className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}
				aria-hidden="true"
			>
				{checkIcon}
			</span>

			<span className={styles.techLabel}>
				{techIcon}
				<span className={styles.techName}>{tech}</span>
			</span>
		</label>
	);
};
