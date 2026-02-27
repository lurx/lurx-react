import type { FilterPanelProps } from './filter-panel.types';
import styles from './filter-panel.module.scss';

export const FilterPanel = ({ children }: FilterPanelProps) => (
	<aside className={styles.filterPanel}>{children}</aside>
);
